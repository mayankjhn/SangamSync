from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import json
import random
from typing import List
from pydantic import BaseModel

import models
import schemas
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SangamSync Command Center API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# LOCAL INTELLIGENT INCIDENT CLASSIFIER
# No API needed — runs offline, instant, reliable
# ─────────────────────────────────────────────

INCIDENT_RULES = [
    {
        "type": "Medical Emergency",
        "priority": "Critical",
        "keywords": ["medical", "unconscious", "injured", "ambulance", "doctor", "hurt", "bleeding", "fainted", "heart", "breathing", "accident", "pain", "hospital"],
        "required_skills": ["Medical", "First Aid"],
        "required_count": 3,
        "icon": "🏥"
    },
    {
        "type": "Missing Person",
        "priority": "High",
        "keywords": ["missing", "lost", "child", "gone", "disappeared", "found", "separated", "cannot find", "can't find"],
        "required_skills": ["Search & Rescue", "Communication"],
        "required_count": 4,
        "icon": "🔍"
    },
    {
        "type": "Crowd Surge",
        "priority": "High",
        "keywords": ["crowd", "surge", "stampede", "rush", "gathering", "push", "overcrowd", "dense", "mob", "crush", "pressure"],
        "required_skills": ["Crowd Management", "Security"],
        "required_count": 5,
        "icon": "👥"
    },
    {
        "type": "Security Threat",
        "priority": "Critical",
        "keywords": ["fight", "violence", "weapon", "theft", "attack", "robbery", "threat", "suspect", "conflict", "assault", "dangerous"],
        "required_skills": ["Security", "Law Enforcement"],
        "required_count": 4,
        "icon": "🚨"
    },
    {
        "type": "Fire Emergency",
        "priority": "Critical",
        "keywords": ["fire", "smoke", "burning", "flame", "blaze", "spark", "explosion"],
        "required_skills": ["Fire Safety", "Medical"],
        "required_count": 4,
        "icon": "🔥"
    },
    {
        "type": "Infrastructure Failure",
        "priority": "Medium",
        "keywords": ["power", "electricity", "structure", "collapse", "breakdown", "damage", "barrier", "fallen", "broken", "leak"],
        "required_skills": ["Technical", "Logistics"],
        "required_count": 3,
        "icon": "⚠️"
    },
]

def extract_sector(text: str) -> str:
    """Extract sector from text using keyword matching."""
    import re
    text_lower = text.lower()
    # Match "sector X" where X is a number or letter
    match = re.search(r'sector\s+([a-zA-Z0-9]+)', text_lower)
    if match:
        return f"Sector {match.group(1).upper()}"
    # Match "gate X"
    match = re.search(r'gate\s+([a-zA-Z0-9]+)', text_lower)
    if match:
        return f"Gate {match.group(1).upper()}"
    return "Unknown"

def classify_incident(text: str) -> dict:
    """Classify incident using keyword rules — fast, offline, reliable."""
    text_lower = text.lower()
    
    best_match = None
    best_score = 0
    
    for rule in INCIDENT_RULES:
        score = sum(1 for kw in rule["keywords"] if kw in text_lower)
        if score > best_score:
            best_score = score
            best_match = rule
    
    # Default fallback
    if not best_match or best_score == 0:
        best_match = {
            "type": "General Incident",
            "priority": "Medium",
            "required_skills": ["General Assistance"],
            "required_count": 2,
            "icon": "📋"
        }
    
    sector = extract_sector(text)
    
    return {
        "incident_type": best_match["type"],
        "priority": best_match["priority"],
        "sector": sector,
        "required_skills": best_match["required_skills"],
        "required_count": best_match["required_count"],
        "icon": best_match.get("icon", "📋"),
        "confidence": min(100, best_score * 25 + 40)  # Simulated confidence score
    }

# ─────────────────────────────────────────────
# SECTOR DISTANCE MATRIX (simulated)
# ─────────────────────────────────────────────
SECTOR_DISTANCES = {
    ("Sector A", "Sector A"): 0, ("Sector A", "Sector B"): 2, ("Sector A", "Sector C"): 4,
    ("Sector B", "Sector B"): 0, ("Sector B", "Sector C"): 2, ("Sector B", "Sector D"): 3,
    ("Sector C", "Sector C"): 0, ("Sector C", "Sector D"): 1, ("Sector C", "Sector E"): 3,
    ("Sector D", "Sector D"): 0, ("Sector D", "Sector E"): 2, ("Sector D", "Sector F"): 4,
    ("Sector E", "Sector E"): 0, ("Sector E", "Sector F"): 2, ("Sector E", "Sector G"): 3,
    ("Sector F", "Sector F"): 0, ("Sector F", "Sector G"): 1, ("Sector F", "Sector H"): 2,
    ("Sector G", "Sector G"): 0, ("Sector G", "Sector H"): 2,
    ("Sector H", "Sector H"): 0,
}

def get_distance_km(sector1: str, sector2: str) -> float:
    """Get approximate distance between sectors in km."""
    key = (sector1, sector2)
    rev_key = (sector2, sector1)
    if key in SECTOR_DISTANCES:
        return SECTOR_DISTANCES[key]
    if rev_key in SECTOR_DISTANCES:
        return SECTOR_DISTANCES[rev_key]
    return 3  # default distance

def get_response_time(distance_km: float) -> str:
    """Estimate response time based on distance."""
    minutes = int(distance_km * 2 + 1)
    return f"{minutes} minute{'s' if minutes != 1 else ''}"

def get_selection_reasons(volunteer, incident: dict, v_skills: list, skill_match: bool, distance_km: float) -> list:
    """Generate human-readable explainable reasons for volunteer selection."""
    reasons = []
    if skill_match:
        matching = [s for s in v_skills if any(req.lower() in s.lower() or s.lower() in req.lower() for req in incident.get("required_skills", []))]
        if matching:
            reasons.append(f"✓ Skill match: {', '.join(matching)}")
    if distance_km <= 1:
        reasons.append("✓ In same sector (immediate response)")
    elif distance_km <= 2:
        reasons.append(f"✓ Nearby ({distance_km}km away)")
    else:
        reasons.append(f"↔ Located {distance_km}km from incident")
    if volunteer.experience_level == "Expert":
        reasons.append("✓ Expert level volunteer")
    elif volunteer.experience_level == "Intermediate":
        reasons.append("✓ Experienced volunteer")
    if volunteer.hours_worked < 4:
        reasons.append("✓ Fresh — low workload")
    elif volunteer.hours_worked < 8:
        reasons.append("~ Moderate workload")
    else:
        reasons.append("⚠ High workload — use if no other option")
    if volunteer.consecutive_tasks < 3:
        reasons.append("✓ Low consecutive task count")
    return reasons


# ─────────────────────────────────────────────
# API ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "SangamSync API is running!", "version": "2.0", "mode": "Local Intelligence Engine"}

@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_volunteers = db.query(models.Volunteer).count()
    active_volunteers = db.query(models.Volunteer).filter(models.Volunteer.availability == "Available").count()
    ongoing_incidents = db.query(models.Incident).filter(models.Incident.status.in_(["Pending", "In Progress"])).count()
    critical_alerts = db.query(models.Incident).filter(models.Incident.priority == "Critical").count()
    
    # Sector health
    sectors = db.query(models.Volunteer.sector).distinct().all()
    sector_stats = []
    for (sector,) in sectors:
        count = db.query(models.Volunteer).filter(
            models.Volunteer.sector == sector,
            models.Volunteer.availability == "Available"
        ).count()
        total = db.query(models.Volunteer).filter(models.Volunteer.sector == sector).count()
        coverage = round((count / total) * 100) if total > 0 else 0
        sector_stats.append({
            "sector": sector,
            "available": count,
            "total": total,
            "coverage": coverage,
            "status": "critical" if coverage < 40 else "warning" if coverage < 70 else "safe"
        })
    
    return {
        "total_volunteers": total_volunteers,
        "active_volunteers": active_volunteers,
        "ongoing_incidents": ongoing_incidents,
        "critical_alerts": critical_alerts,
        "sector_stats": sector_stats
    }

@app.get("/api/volunteers", response_model=List[schemas.Volunteer])
def read_volunteers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    volunteers = db.query(models.Volunteer).offset(skip).limit(limit).all()
    return volunteers

@app.get("/api/incidents", response_model=List[schemas.Incident])
def read_incidents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    incidents = db.query(models.Incident).offset(skip).limit(limit).all()
    return incidents

@app.post("/api/ai/analyze-incident")
def analyze_incident(text: str):
    """
    Intelligent local incident classifier.
    Uses keyword rules — instant, offline, 100% reliable.
    """
    try:
        result = classify_incident(text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/allocate-volunteers")
def allocate_volunteers(incident: dict, db: Session = Depends(get_db)):
    """
    Smart Allocation Engine with Explainable Recommendations.
    Scores volunteers on: Skills(40%) + Distance(25%) + Availability(15%) + Experience(10%) + Workload(10%)
    Returns top 3 with full explanations.
    """
    volunteers = db.query(models.Volunteer).filter(models.Volunteer.availability == "Available").all()
    
    required_skills = incident.get("required_skills", [])
    incident_sector = incident.get("sector", "Unknown")
    
    scored_volunteers = []
    
    for v in volunteers:
        score = 0
        try:
            v_skills = json.loads(v.skills) if isinstance(v.skills, str) else (v.skills or [])
        except:
            v_skills = []
        
        # Skill Match = 40%
        required_lower = [r.lower() for r in required_skills]
        skill_match = any(
            any(req in skill.lower() or skill.lower() in req for req in required_lower)
            for skill in v_skills
        )
        if skill_match:
            score += 40
        
        # Distance (Sector proximity) = 25%
        distance_km = get_distance_km(v.sector, incident_sector)
        if distance_km == 0:
            score += 25
        elif distance_km <= 1:
            score += 20
        elif distance_km <= 2:
            score += 15
        elif distance_km <= 3:
            score += 8
        
        # Experience = 10%
        if v.experience_level == "Expert":
            score += 10
        elif v.experience_level == "Intermediate":
            score += 5
        
        # Workload (Inverse) = 10%
        if v.hours_worked < 4:
            score += 10
        elif v.hours_worked < 8:
            score += 5
        
        # Availability base = 15%
        score += 15
        
        # Build explanation
        reasons = get_selection_reasons(v, incident, v_skills, skill_match, distance_km)
        response_time = get_response_time(distance_km)
        
        scored_volunteers.append({
            "volunteer": schemas.Volunteer.model_validate(v),
            "match_score": score,
            "reasons": reasons,
            "response_time": response_time,
            "distance_km": distance_km
        })
    
    scored_volunteers.sort(key=lambda x: x["match_score"], reverse=True)
    return scored_volunteers[:3]
