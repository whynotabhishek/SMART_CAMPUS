from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReportCreate(BaseModel):
    type: str
    title: str
    description: str
    category: str
    location_zone: str
    reported_at: Optional[datetime] = None
    contact_name: str
    contact_email: str
    contact_phone: Optional[str] = None
    hidden_details: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    type: str
    title: str
    description: str
    category: str
    location_zone: str
    reported_at: datetime
    contact_name: str
    contact_email: str
    contact_phone: Optional[str] = None
    status: str
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class MatchScores(BaseModel):
    visual_score: float
    text_score: float
    location_score: float
    time_score: float

class MatchResult(BaseModel):
    id: str
    matched_report: ReportResponse
    overall_score: float
    scores: MatchScores
    explanation: str

class MatchListResponse(BaseModel):
    report_id: str
    matches: List[MatchResult]

class ClaimCreate(BaseModel):
    claimer_name: str
    claimer_email: str

class ClaimResponse(BaseModel):
    claim_id: str
    verification_question: str

class ClaimVerifyRequest(BaseModel):
    answer: str

class ClaimVerifyResponse(BaseModel):
    status: str
    contact_info: Optional[Dict[str, Any]] = None
