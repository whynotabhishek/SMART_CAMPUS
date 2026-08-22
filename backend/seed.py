import asyncio
import uuid
import json
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

from database import get_supabase
from services.embeddings import get_text_embedding
from services.matching import find_matches

load_dotenv()

async def seed_db():
    supabase = get_supabase()
    print("Starting database seed...")
    
    now = datetime.now(timezone.utc)
    
    reports = [
        {
            "type": "lost",
            "title": "Blue JBL Earbuds Case",
            "description": "Small blue JBL earbuds charging case, has a small scratch on the lid. Contains wireless earbuds inside.",
            "category": "Electronics",
            "location_zone": "Library",
            "reported_at": (now - timedelta(hours=2)).isoformat(),
            "contact_name": "Rahul Sharma",
            "contact_email": "rahul.s@iitd.ac.in",
            "hidden_details": "scratch on right side of lid"
        },
        {
            "type": "found",
            "title": "Wireless Earbuds in Blue Case",
            "description": "Found a compact blue case with wireless earbuds near the reading section. Brand looks like JBL, minor scratch visible.",
            "category": "Electronics",
            "location_zone": "Library",
            "reported_at": (now - timedelta(hours=1)).isoformat(),
            "contact_name": "Library Admin",
            "contact_email": "library@iitd.ac.in"
        },
        {
            "type": "lost",
            "title": "Black North Face Backpack",
            "description": "Black North Face backpack with a broken front zipper. Has a water bottle in side pocket and laptop inside. Small red keychain on main zipper.",
            "category": "Bags & Wallets",
            "location_zone": "Canteen",
            "reported_at": (now - timedelta(days=1, hours=2)).isoformat(),
            "contact_name": "Sneha Patel",
            "contact_email": "sneha.p@iitd.ac.in",
            "hidden_details": "red keychain, laptop is a Dell"
        },
        {
            "type": "found",
            "title": "Dark Backpack with Broken Zipper",
            "description": "Found a dark-colored large backpack near the canteen counter. Front zipper seems broken. Feels heavy, might have laptop inside.",
            "category": "Bags & Wallets",
            "location_zone": "Canteen",
            "reported_at": (now - timedelta(days=1, hours=-2)).isoformat(),
            "contact_name": "Canteen Staff",
            "contact_email": "canteen@iitd.ac.in"
        },
        {
            "type": "lost",
            "title": "Silver MacBook Charger",
            "description": "Apple MacBook charging cable with magnetic connector, silver/white. Small piece of green tape wrapped near the plug.",
            "category": "Electronics",
            "location_zone": "Academic Block",
            "reported_at": (now - timedelta(hours=4)).isoformat(),
            "contact_name": "Arjun Kumar",
            "contact_email": "arjun.k@iitd.ac.in",
            "hidden_details": "green tape near the plug end"
        },
        {
            "type": "found",
            "title": "Laptop Charger with Green Tape",
            "description": "White Apple laptop charger found in lecture hall 3. Notable green tape mark on cable.",
            "category": "Electronics",
            "location_zone": "Academic Block",
            "reported_at": (now - timedelta(hours=3)).isoformat(),
            "contact_name": "Aditi Verma",
            "contact_email": "aditi.v@iitd.ac.in"
        },
        {
            "type": "lost",
            "title": "Red Dented Water Bottle",
            "description": "Stainless steel red water bottle, about 750ml. Has a noticeable dent on the bottom and a faded mountain sticker on side.",
            "category": "Water Bottles",
            "location_zone": "Gym",
            "reported_at": (now - timedelta(hours=3)).isoformat(),
            "contact_name": "Vikram Singh",
            "contact_email": "vikram.s@iitd.ac.in",
            "hidden_details": "mountain sticker, dent on bottom"
        },
        {
            "type": "found",
            "title": "Red Metal Water Bottle",
            "description": "Found red stainless steel bottle on bench near treadmills. Has some dent, looks used.",
            "category": "Water Bottles",
            "location_zone": "Sports Ground",
            "reported_at": (now - timedelta(hours=4)).isoformat(),
            "contact_name": "Sports Coordinator",
            "contact_email": "sports@iitd.ac.in"
        },
        {
            "type": "lost",
            "title": "Student ID Card — Priya Mehta",
            "description": "Lost my student ID card around the hostel. Name: Priya Mehta, 3rd year CSE, has my photo on it. Blue lanyard attached.",
            "category": "ID & Documents",
            "location_zone": "Hostel Block A",
            "reported_at": (now - timedelta(hours=5)).isoformat(),
            "contact_name": "Priya Mehta",
            "contact_email": "priya.m@iitd.ac.in",
            "hidden_details": "blue lanyard, CSE department"
        },
        {
            "type": "found",
            "title": "Brown Leather Wallet",
            "description": "Small brown leather wallet found near main gate security cabin. Contains some cash and cards. Initials 'AK' embossed on front.",
            "category": "Bags & Wallets",
            "location_zone": "Main Gate",
            "reported_at": (now - timedelta(days=1, hours=3)).isoformat(),
            "contact_name": "Security Office",
            "contact_email": "security@iitd.ac.in"
        }
    ]
    
    inserted_reports = []
    
    for r in reports:
        print(f"Processing report: {r['title']}...")
        r['id'] = str(uuid.uuid4())
        r['status'] = 'open'
        r['created_at'] = now.isoformat()
        r['updated_at'] = now.isoformat()
        
        embedding = await get_text_embedding(f"{r['title']}. {r['description']}")
        if embedding:
            r['text_embedding'] = f"[{','.join(map(str, embedding))}]"
            
        try:
            res = supabase.table('reports').insert(r).execute()
            inserted_reports.append(res.data[0])
            print(f"Inserted: {r['title']}")
        except Exception as e:
            print(f"Failed to insert {r['title']}: {e}")
            
    print("\nRunning matching engine for all reports...")
    
    for rep in inserted_reports:
        print(f"Finding matches for: {rep['title']}")
        await find_matches(rep, supabase)
        
    print("Seed complete!")

if __name__ == "__main__":
    asyncio.run(seed_db())
