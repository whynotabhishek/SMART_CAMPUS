from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timezone
import uuid
import json

from models import ReportCreate, ReportResponse
from database import get_supabase
from services.embeddings import get_text_embedding, get_image_embedding
from services.matching import find_matches
import base64

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.post("/", response_model=dict)
async def create_report(report: ReportCreate):
    supabase = get_supabase()
    
    text_to_embed = f"{report.title}. {report.description}"
    embedding = await get_text_embedding(text_to_embed)
    
    image_embedding = None
    if report.image_base64:
        try:
            # Decode base64 to bytes
            image_data = base64.b64decode(report.image_base64.split(",")[1] if "," in report.image_base64 else report.image_base64)
            image_embedding = await get_image_embedding(image_data)
        except Exception as e:
            print("Image embedding error:", e)

    now = datetime.now(timezone.utc).isoformat()
    reported_at = report.reported_at.isoformat() if report.reported_at else now

    report_id = str(uuid.uuid4())
    
    report_dict = {
        "id": report_id,
        "type": report.type,
        "title": report.title,
        "description": report.description,
        "category": report.category,
        "location_zone": report.location_zone,
        "reported_at": reported_at,
        "contact_name": report.contact_name,
        "contact_email": report.contact_email,
        "contact_phone": report.contact_phone,
        "hidden_details": report.hidden_details,
        "status": "open",
        "created_at": now,
        "updated_at": now
    }
    
    if embedding:
        report_dict["text_embedding"] = f"[{','.join(map(str, embedding))}]"
    if image_embedding:
        report_dict["image_embedding"] = f"[{','.join(map(str, image_embedding))}]"

    try:
        res = supabase.table('reports').insert(report_dict).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to create report")
        
        inserted_report = res.data[0]
        
        matches = await find_matches(inserted_report, supabase)
        
        # Clean up sensitive info before returning
        inserted_report.pop('text_embedding', None)
        inserted_report.pop('image_embedding', None)
        inserted_report.pop('hidden_details', None)
        
        return {"report": inserted_report, "matches": matches}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ReportResponse])
async def list_reports(
    type: Optional[str] = None,
    category: Optional[str] = None,
    location_zone: Optional[str] = None,
    status: str = "open",
    search: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    supabase = get_supabase()
    query = supabase.table('reports').select('*')
    
    if type:
        query = query.eq('type', type)
    if category:
        query = query.eq('category', category)
    if location_zone:
        query = query.eq('location_zone', location_zone)
    if status:
        query = query.eq('status', status)
        
    if search:
        query = query.or_(f"title.ilike.%{search}%,description.ilike.%{search}%")
        
    query = query.order('reported_at', desc=True).range(offset, offset + limit - 1)
    
    try:
        res = query.execute()
        reports = res.data
        for r in reports:
            r.pop('text_embedding', None)
            r.pop('image_embedding', None)
            r.pop('hidden_details', None)
        return reports
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(report_id: str):
    supabase = get_supabase()
    try:
        res = supabase.table('reports').select('*').eq('id', report_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Report not found")
        
        report = res.data[0]
        report.pop('text_embedding', None)
        report.pop('image_embedding', None)
        report.pop('hidden_details', None)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{report_id}", response_model=ReportResponse)
async def update_report_status(report_id: str, status_update: dict):
    if "status" not in status_update:
        raise HTTPException(status_code=400, detail="Missing status field")
        
    supabase = get_supabase()
    now = datetime.now(timezone.utc).isoformat()
    try:
        res = supabase.table('reports').update({
            "status": status_update["status"],
            "updated_at": now
        }).eq('id', report_id).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Report not found")
            
        report = res.data[0]
        report.pop('text_embedding', None)
        report.pop('image_embedding', None)
        report.pop('hidden_details', None)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
