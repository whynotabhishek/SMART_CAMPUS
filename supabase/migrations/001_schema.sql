-- ============================================================
-- CampusFind Database Schema
-- Supabase Postgres + pgvector
-- ============================================================

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- REPORTS TABLE
-- ============================================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location_zone TEXT NOT NULL,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  image_url TEXT,
  contact_name TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'claimed', 'closed')),
  hidden_details TEXT,          -- withheld for claim verification
  image_embedding VECTOR(512),  -- CLIP ViT-B/32
  text_embedding VECTOR(384),   -- all-MiniLM-L6-v2
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- MATCHES TABLE
-- ============================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lost_report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  found_report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  overall_score FLOAT NOT NULL,
  visual_score FLOAT NOT NULL DEFAULT 0,
  text_score FLOAT NOT NULL DEFAULT 0,
  location_score FLOAT NOT NULL DEFAULT 0,
  time_score FLOAT NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lost_report_id, found_report_id)
);

-- ============================================================
-- CLAIMS TABLE
-- ============================================================
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  claimer_name TEXT NOT NULL,
  claimer_email TEXT NOT NULL,
  verification_question TEXT NOT NULL,
  verification_answer TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_reports_type_status ON reports(type, status);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_zone ON reports(location_zone);
CREATE INDEX idx_matches_lost ON matches(lost_report_id);
CREATE INDEX idx_matches_found ON matches(found_report_id);
CREATE INDEX idx_claims_match ON claims(match_id);

-- HNSW indexes for vector similarity (better recall than IVFFlat)
CREATE INDEX idx_reports_text_emb ON reports
  USING hnsw (text_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_reports_image_emb ON reports
  USING hnsw (image_embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- ============================================================
-- RPC: Find candidate matches by text embedding
-- ============================================================
CREATE OR REPLACE FUNCTION match_by_text_embedding(
  query_embedding VECTOR(384),
  match_type TEXT,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  location_zone TEXT,
  reported_at TIMESTAMPTZ,
  image_url TEXT,
  status TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  hidden_details TEXT,
  text_similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    r.id,
    r.title,
    r.description,
    r.category,
    r.location_zone,
    r.reported_at,
    r.image_url,
    r.status,
    r.contact_name,
    r.contact_email,
    r.contact_phone,
    r.hidden_details,
    1 - (r.text_embedding <=> query_embedding) AS text_similarity
  FROM reports r
  WHERE r.type = match_type
    AND r.status = 'open'
    AND r.text_embedding IS NOT NULL
  ORDER BY r.text_embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================================
-- RPC: Find candidate matches by image embedding
-- ============================================================
CREATE OR REPLACE FUNCTION match_by_image_embedding(
  query_embedding VECTOR(512),
  match_type TEXT,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  location_zone TEXT,
  reported_at TIMESTAMPTZ,
  image_url TEXT,
  status TEXT,
  image_similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    r.id,
    r.title,
    r.description,
    r.category,
    r.location_zone,
    r.reported_at,
    r.image_url,
    r.status,
    1 - (r.image_embedding <=> query_embedding) AS image_similarity
  FROM reports r
  WHERE r.type = match_type
    AND r.status = 'open'
    AND r.image_embedding IS NOT NULL
  ORDER BY r.image_embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================================
-- Row-Level Security (basic, permissive for demo)
-- ============================================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Allow all operations via service role key (backend)
CREATE POLICY "Service role full access" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON claims FOR ALL USING (true) WITH CHECK (true);

-- Allow anon read on reports and matches
CREATE POLICY "Anon read reports" ON reports FOR SELECT USING (true);
CREATE POLICY "Anon read matches" ON matches FOR SELECT USING (true);
