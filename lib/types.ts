export interface Report {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location_zone: string;
  reported_at: string;
  image_url: string | null;
  status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchScores {
  visual_score: number;
  text_score: number;
  location_score: number;
  time_score: number;
}

export interface MatchResult {
  id: string;
  matched_report: Report;
  overall_score: number;
  scores: MatchScores;
  explanation: string;
}

export interface MatchListResponse {
  report_id: string;
  matches: MatchResult[];
}

export interface ClaimResponse {
  claim_id: string;
  verification_question: string;
}

export interface ClaimVerifyResponse {
  status: 'verified' | 'rejected';
  contact_info?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface ReportFormData {
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location_zone: string;
  reported_at: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  hidden_details: string;
  image_base64?: string;
}
