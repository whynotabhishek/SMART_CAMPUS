from fastapi import APIRouter, HTTPException
from typing import List

from models import MatchListResponse, MatchResult
from database import get_supabase

router = APIRouter(prefix="/api/matches", tags=["matches"])

@router.get("/report/{report_id}", response_model=MatchListResponse)
async def get_matches_for_report(report_id: str):
    supabase = get_supabase()
    
    try:
        # Get matches where report is lost or found
        res_lost = supabase.table('matches').select('*, found_report:reports!found_report_id(*)').eq('lost_report_id', report_id).execute()
        res_found = supabase.table('matches').select('*, lost_report:reports!lost_report_id(*)').eq('found_report_id', report_id).execute()
        
        matches = []
        
        for m in res_lost.data:
            report_data = m['found_report']
            if report_data:
                report_data.pop('text_embedding', None)
                report_data.pop('image_embedding', None)
                report_data.pop('hidden_details', None)
                matches.append({
                    "id": m["id"],
                    "matched_report": report_data,
                    "overall_score": m["overall_score"],
                    "scores": {
                        "visual_score": m["visual_score"],
                        "text_score": m["text_score"],
                        "location_score": m["location_score"],
                        "time_score": m["time_score"]
                    },
                    "explanation": m["explanation"]
                })
                
        for m in res_found.data:
            report_data = m['lost_report']
            if report_data:
                report_data.pop('text_embedding', None)
                report_data.pop('image_embedding', None)
                report_data.pop('hidden_details', None)
                matches.append({
                    "id": m["id"],
                    "matched_report": report_data,
                    "overall_score": m["overall_score"],
                    "scores": {
                        "visual_score": m["visual_score"],
                        "text_score": m["text_score"],
                        "location_score": m["location_score"],
                        "time_score": m["time_score"]
                    },
                    "explanation": m["explanation"]
                })
                
        matches.sort(key=lambda x: x["overall_score"], reverse=True)
        return MatchListResponse(report_id=report_id, matches=matches)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{match_id}")
async def get_single_match(match_id: str):
    supabase = get_supabase()
    try:
        res = supabase.table('matches').select('*, lost_report:reports!lost_report_id(*), found_report:reports!found_report_id(*)').eq('id', match_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Match not found")
            
        data = res.data[0]
        
        if data.get('lost_report'):
            data['lost_report'].pop('text_embedding', None)
            data['lost_report'].pop('image_embedding', None)
            data['lost_report'].pop('hidden_details', None)
            
        if data.get('found_report'):
            data['found_report'].pop('text_embedding', None)
            data['found_report'].pop('image_embedding', None)
            data['found_report'].pop('hidden_details', None)
            
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
