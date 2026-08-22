from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from config import FRONTEND_URL, WEIGHT_VISUAL, WEIGHT_TEXT, WEIGHT_LOCATION, WEIGHT_TIME, ZONES
from routers import reports, matches, claims
from database import get_supabase

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CampusFind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reports.router)
app.include_router(matches.router)
app.include_router(claims.router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting CampusFind API...")
    logger.info(f"Weights - Visual: {WEIGHT_VISUAL}, Text: {WEIGHT_TEXT}, Location: {WEIGHT_LOCATION}, Time: {WEIGHT_TIME}")
    logger.info(f"Loaded {len(ZONES)} zones.")

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/stats")
async def get_stats():
    supabase = get_supabase()
    try:
        reports_res = supabase.table('reports').select('id', count='exact').eq('status', 'open').execute()
        matches_res = supabase.table('matches').select('id', count='exact').execute()
        
        return {
            "open_reports": reports_res.count if reports_res.count is not None else 0,
            "total_matches": matches_res.count if matches_res.count is not None else 0
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return {"error": "Could not fetch stats"}
