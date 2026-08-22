import random
import re
from typing import Dict, Any

def generate_verification_question(report: Dict[str, Any]) -> str:
    category = report.get('category', 'Other')
    description = report.get('description', '').lower()
    title = report.get('title', '').lower()
    full_text = description + " " + title
    
    colors = ['red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'purple', 'pink', 'brown', 'grey', 'silver', 'gold']
    found_colors = [c for c in colors if c in full_text]
    
    brands = ['apple', 'samsung', 'jbl', 'sony', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'nike', 'adidas', 'puma', 'reklam', 'north face', 'wildcraft']
    found_brands = [b for b in brands if b in full_text]

    questions = {
        'Electronics': [
            "What brand is the device?",
            "What colour case does it have?",
            "Describe any stickers or marks.",
            "What is the lock screen?"
        ],
        'Bags & Wallets': [
            "What's inside the front pocket?",
            "Describe any logos or brand markings.",
            "What colour is the interior lining?",
            "How many compartments?"
        ],
        'Clothing': [
            "What size is it?",
            "What brand is on the tag?",
            "Any stains, tears, or wear marks?"
        ],
        'ID & Documents': [
            "What name is on the ID?",
            "Which department or year?",
            "Describe the photo on the card."
        ],
        'Keys': [
            "How many keys on the ring?",
            "Describe the keychain.",
            "What type of keys?"
        ],
        'Water Bottles': [
            "What colour is the cap?",
            "Any stickers or dents?",
            "What brand?"
        ],
        'Books': [
            "What is the title or subject?",
            "Any notes written inside?",
            "What colour is the cover?"
        ],
        'Other': [
            "Describe any unique feature or marking.",
            "What material is it made of?"
        ]
    }
    
    cat_questions = questions.get(category, questions['Other'])
    
    # Try to pick a question about something NOT explicitly mentioned
    filtered_questions = []
    for q in cat_questions:
        q_lower = q.lower()
        if 'colour' in q_lower or 'color' in q_lower:
            if not found_colors:
                filtered_questions.append(q)
        elif 'brand' in q_lower:
            if not found_brands:
                filtered_questions.append(q)
        else:
            filtered_questions.append(q)
            
    if not filtered_questions:
        filtered_questions = cat_questions
        
    return random.choice(filtered_questions)
