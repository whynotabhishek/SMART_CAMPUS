import httpx
import numpy as np
import logging
from typing import Optional, List
from config import HF_API_TOKEN, TEXT_API_URL, CLIP_API_URL

logger = logging.getLogger(__name__)

def normalize_vector(v: List[float]) -> List[float]:
    arr = np.array(v)
    norm = np.linalg.norm(arr)
    if norm == 0:
        return v
    return (arr / norm).tolist()

async def get_text_embedding(text: str) -> Optional[List[float]]:
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                TEXT_API_URL, 
                headers=headers, 
                json={"inputs": text}
            )
            response.raise_for_status()
            data = response.json()
            # Handle nested arrays
            if isinstance(data, list):
                if len(data) > 0 and isinstance(data[0], list):
                    embedding = data[0]
                else:
                    embedding = data
                return normalize_vector(embedding)
            return None
    except Exception as e:
        logger.error(f"Error getting text embedding: {e}")
        return None

async def get_image_embedding(image_bytes: bytes) -> Optional[List[float]]:
    headers = {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/octet-stream"
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                CLIP_API_URL, 
                headers=headers, 
                content=image_bytes
            )
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list):
                return normalize_vector(data)
            return None
    except Exception as e:
        logger.error(f"Error getting image embedding: {e}")
        return None
