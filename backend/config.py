import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
HF_API_TOKEN = os.getenv("HF_API_TOKEN", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

WEIGHT_VISUAL = 0.30
WEIGHT_TEXT = 0.35
WEIGHT_LOCATION = 0.20
WEIGHT_TIME = 0.15

TIME_DECAY_BETA = 0.03
LOCATION_DECAY_BETA = 0.5

CLIP_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/openai/clip-vit-base-patch32"
TEXT_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"

CLIP_EMBEDDING_DIM = 512
TEXT_EMBEDDING_DIM = 384

CATEGORIES = [
    "Electronics", "Bags & Wallets", "Clothing", "ID & Documents", 
    "Keys", "Water Bottles", "Books", "Other"
]

ZONES = [
    "Library", "Canteen", "Hostel Block A", "Hostel Block B", 
    "Gym", "Main Gate", "Academic Block", "Sports Ground", "Auditorium"
]

ZONE_COORDINATES = {
    "Library": (0, 0),
    "Academic Block": (1, 0.5),
    "Auditorium": (0.5, 1),
    "Canteen": (2, 1),
    "Gym": (1.5, 2.5),
    "Main Gate": (4, 0),
    "Hostel Block A": (3, 2.5),
    "Hostel Block B": (3.5, 2.5),
    "Sports Ground": (2, 3.5)
}
