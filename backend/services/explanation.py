import random
from typing import Dict, Any
from datetime import datetime

def generate_explanation(visual_score: float, text_score: float, location_score: float, time_score: float, overall_score: float, report_a: Dict[str, Any], report_b: Dict[str, Any]) -> str:
    category = report_a.get('category', 'item').lower()
    zone_a = report_a.get('location_zone', 'a location')
    zone_b = report_b.get('location_zone', 'a location')
    
    try:
        t_a = datetime.fromisoformat(report_a['reported_at'].replace('Z', '+00:00'))
        t_b = datetime.fromisoformat(report_b['reported_at'].replace('Z', '+00:00'))
        hours_diff = round(abs((t_a - t_b).total_seconds()) / 3600.0)
    except:
        hours_diff = 0

    parts = []
    
    # Text
    if text_score >= 0.7:
        parts.append(random.choice([
            "the descriptions closely align",
            f"both descriptions point to a very similar {category} item",
            "the written details are a strong match"
        ]))
    elif text_score >= 0.4:
        parts.append(random.choice([
            "the descriptions have some similarities",
            f"there is a potential match based on the item descriptions"
        ]))

    # Location
    if location_score >= 0.7:
        if zone_a == zone_b:
            parts.append(random.choice([
                f"both reports are from the {zone_a}",
                f"both were reported in the same area ({zone_a})"
            ]))
        else:
            parts.append(random.choice([
                f"the {zone_a} and {zone_b} are close together on campus",
                "the reported locations are nearby"
            ]))
    elif location_score >= 0.4:
        parts.append("the locations are reasonably close")

    # Time
    if time_score >= 0.7:
        if hours_diff < 3:
            parts.append(f"the reports are only {hours_diff} hours apart")
        else:
            parts.append("both reports are from today")
    elif time_score >= 0.4:
        parts.append("the timing of the reports aligns well")

    # Visual
    if visual_score >= 0.7:
        parts.append("the photos show visually similar items")
    elif visual_score >= 0.4:
        parts.append("the uploaded images share some similarities")

    if overall_score >= 70:
        opener = "Strong match"
    elif overall_score >= 55:
        opener = "Likely match"
    elif overall_score >= 40:
        opener = "Possible match"
    elif overall_score >= 25:
        opener = "Weak match"
    else:
        opener = "Long shot"

    if overall_score < 40 and not parts:
        parts.append("details loosely align")

    explanation = opener + " because "
    
    if len(parts) == 1:
        explanation += parts[0] + "."
    elif len(parts) > 1:
        explanation += ", ".join(parts[:-1]) + ", and " + parts[-1] + "."
    else:
        explanation = opener + "."

    if overall_score < 40:
        explanation += " However, there are significant differences in the details."

    return explanation
