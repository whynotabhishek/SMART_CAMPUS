from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import uuid

from models import ClaimCreate, ClaimResponse, ClaimVerifyRequest, ClaimVerifyResponse
from database import get_supabase
from services.verification import generate_verification_question

router = APIRouter(prefix="/api/claims", tags=["claims"])

@router.post("/match/{match_id}", response_model=ClaimResponse)
async def create_claim(match_id: str, claim: ClaimCreate):
    supabase = get_supabase()
    try:
        match_res = supabase.table('matches').select('*').eq('id', match_id).execute()
        if not match_res.data:
            raise HTTPException(status_code=404, detail="Match not found")
            
        match_data = match_res.data[0]
        
        report_res = supabase.table('reports').select('*').eq('id', match_data['found_report_id']).execute()
        if not report_res.data:
            raise HTTPException(status_code=404, detail="Found report not found")
            
        found_report = report_res.data[0]
        
        question = generate_verification_question(found_report)
        
        claim_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        supabase.table('claims').insert({
            'id': claim_id,
            'match_id': match_id,
            'claimer_name': claim.claimer_name,
            'claimer_email': claim.claimer_email,
            'verification_question': question,
            'status': 'pending',
            'created_at': now
        }).execute()
        
        return ClaimResponse(claim_id=claim_id, verification_question=question)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{claim_id}/verify", response_model=ClaimVerifyResponse)
async def verify_claim(claim_id: str, request: ClaimVerifyRequest):
    supabase = get_supabase()
    try:
        claim_res = supabase.table('claims').select('*').eq('id', claim_id).execute()
        if not claim_res.data:
            raise HTTPException(status_code=404, detail="Claim not found")
            
        claim_data = claim_res.data[0]
        
        match_res = supabase.table('matches').select('*').eq('id', claim_data['match_id']).execute()
        if not match_res.data:
            raise HTTPException(status_code=404, detail="Match not found")
            
        match_data = match_res.data[0]
        
        report_res = supabase.table('reports').select('contact_name, contact_email, contact_phone').eq('id', match_data['found_report_id']).execute()
        if not report_res.data:
            raise HTTPException(status_code=404, detail="Contact info not found")
            
        contact_info = report_res.data[0]
        now = datetime.now(timezone.utc).isoformat()
        
        # Simple verification: length > 3
        if len(request.answer.strip()) > 3:
            supabase.table('claims').update({
                'status': 'verified',
                'verification_answer': request.answer.strip()
            }).eq('id', claim_id).execute()
            
            return ClaimVerifyResponse(status="verified", contact_info=contact_info)
        else:
            supabase.table('claims').update({
                'status': 'rejected',
                'verification_answer': request.answer.strip()
            }).eq('id', claim_id).execute()
            
            return ClaimVerifyResponse(status="rejected")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/match/{match_id}")
async def get_claims_for_match(match_id: str):
    supabase = get_supabase()
    try:
        res = supabase.table('claims').select('*').eq('match_id', match_id).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
