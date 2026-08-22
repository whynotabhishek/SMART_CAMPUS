import math
import numpy as np
from datetime import datetime, timezone
import json
import uuid
import logging
from typing import List, Dict, Any, Optional

from config import (
    WEIGHT_VISUAL, WEIGHT_TEXT, WEIGHT_LOCATION, WEIGHT_TIME,
    TIME_DECAY_BETA, LOCATION_DECAY_BETA, ZONE_COORDINATES
)
from .explanation import generate_explanation

logger = logging.getLogger(__name__)

def cosine_similarity(a: Optional[List[float]], b: Optional[List[float]]) -> float:
    if not a or not b:
        return 0.0
    arr_a = np.array(a)
    arr_b = np.array(b)
    norm_a = np.linalg.norm(arr_a)
    norm_b = np.linalg.norm(arr_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(arr_a, arr_b) / (norm_a * norm_b))

def compute_visual_score(emb_a: Optional[List[float]], emb_b: Optional[List[float]]) -> float:
    score = cosine_similarity(emb_a, emb_b)
    return max(0.0, min(1.0, score))

def compute_text_score(emb_a: Optional[List[float]], emb_b: Optional[List[float]]) -> float:
    score = cosine_similarity(emb_a, emb_b)
    return max(0.0, min(1.0, score))

def compute_location_score(zone_a: str, zone_b: str) -> float:
    if zone_a == zone_b:
        return 1.0
    coord_a = ZONE_COORDINATES.get(zone_a)
    coord_b = ZONE_COORDINATES.get(zone_b)
    if not coord_a or not coord_b:
        return 0.0
    
    distance = math.sqrt((coord_a[0] - coord_b[0])**2 + (coord_a[1] - coord_b[1])**2)
    return math.exp(-LOCATION_DECAY_BETA * distance)

def compute_time_score(time_a: str, time_b: str) -> float:
    try:
        t_a = datetime.fromisoformat(time_a.replace('Z', '+00:00'))
        t_b = datetime.fromisoformat(time_b.replace('Z', '+00:00'))
        
        diff = abs((t_a - t_b).total_seconds()) / 3600.0
        return math.exp(-TIME_DECAY_BETA * diff)
    except Exception as e:
        logger.error(f"Error computing time score: {e}")
        return 0.0

def compute_overall_score(visual: float, text: float, location: float, time_s: float, has_image: bool) -> float:
    w_vis = WEIGHT_VISUAL
    w_txt = WEIGHT_TEXT
    w_loc = WEIGHT_LOCATION
    w_time = WEIGHT_TIME

    if not has_image:
        total_other_weights = w_txt + w_loc + w_time
        if total_other_weights > 0:
            w_txt += w_vis * (w_txt / total_other_weights)
            w_loc += w_vis * (w_loc / total_other_weights)
            w_time += w_vis * (w_time / total_other_weights)
        w_vis = 0.0

    overall = (visual * w_vis) + (text * w_txt) + (location * w_loc) + (time_s * w_time)
    return overall * 100.0

async def find_matches(report: Dict[str, Any], supabase_client) -> List[Dict[str, Any]]:
    target_type = 'found' if report['type'] == 'lost' else 'lost'
    
    try:
        if report.get('text_embedding'):
            embedding_str = report['text_embedding']
            if isinstance(embedding_str, list):
                embedding_str = f"[{','.join(map(str, embedding_str))}]"
            elif isinstance(embedding_str, str) and not embedding_str.startswith('['):
                # Try to parse string
                try:
                    parsed = json.loads(embedding_str)
                    embedding_str = f"[{','.join(map(str, parsed))}]"
                except:
                    pass

            response = supabase_client.rpc(
                'match_by_text_embedding', 
                {
                    'query_embedding': embedding_str,
                    'match_type': target_type,
                    'match_count': 20
                }
            ).execute()
            candidates = response.data
        else:
            response = supabase_client.table('reports').select('*').eq('type', target_type).eq('status', 'open').execute()
            candidates = response.data
    except Exception as e:
        logger.error(f"RPC/DB error finding matches: {e}")
        candidates = []

    matches = []
    
    emb_a_text = report.get('text_embedding')
    if isinstance(emb_a_text, str):
        try: emb_a_text = json.loads(emb_a_text)
        except: emb_a_text = None
        
    emb_a_image = report.get('image_embedding')
    if isinstance(emb_a_image, str):
        try: emb_a_image = json.loads(emb_a_image)
        except: emb_a_image = None

    has_image = bool(emb_a_image)

    for cand in candidates:
        emb_b_text = cand.get('text_embedding')
        if isinstance(emb_b_text, str):
            try: emb_b_text = json.loads(emb_b_text)
            except: emb_b_text = None
            
        emb_b_image = cand.get('image_embedding')
        if isinstance(emb_b_image, str):
            try: emb_b_image = json.loads(emb_b_image)
            except: emb_b_image = None
            
        if emb_b_image:
            has_image = True

        visual_score = compute_visual_score(emb_a_image, emb_b_image) if has_image else 0.0
        text_score = compute_text_score(emb_a_text, emb_b_text)
        location_score = compute_location_score(report['location_zone'], cand['location_zone'])
        time_score = compute_time_score(report['reported_at'], cand['reported_at'])

        overall = compute_overall_score(visual_score, text_score, location_score, time_score, has_image)
        
        explanation = generate_explanation(
            visual_score, text_score, location_score, time_score, overall, report, cand
        )

        matches.append({
            'candidate': cand,
            'scores': {
                'visual': visual_score,
                'text': text_score,
                'location': location_score,
                'time': time_score
            },
            'overall': overall,
            'explanation': explanation
        })

    matches.sort(key=lambda x: x['overall'], reverse=True)
    
    result_matches = [m for m in matches if m['overall'] > 15]
    if not result_matches and matches:
        result_matches = matches[:3]

    final_results = []
    for m in result_matches:
        match_id = str(uuid.uuid4())
        
        lost_id = report['id'] if report['type'] == 'lost' else m['candidate']['id']
        found_id = m['candidate']['id'] if report['type'] == 'lost' else report['id']
        
        try:
            supabase_client.table('matches').insert({
                'id': match_id,
                'lost_report_id': lost_id,
                'found_report_id': found_id,
                'visual_score': m['scores']['visual'],
                'text_score': m['scores']['text'],
                'location_score': m['scores']['location'],
                'time_score': m['scores']['time'],
                'overall_score': m['overall'],
                'explanation': m['explanation']
            }).execute()
            
            final_results.append({
                'id': match_id,
                'matched_report': m['candidate'],
                'overall_score': m['overall'],
                'scores': {
                    'visual_score': m['scores']['visual'],
                    'text_score': m['scores']['text'],
                    'location_score': m['scores']['location'],
                    'time_score': m['scores']['time']
                },
                'explanation': m['explanation']
            })
        except Exception as e:
            logger.error(f"Error saving match: {e}")

    return final_results
