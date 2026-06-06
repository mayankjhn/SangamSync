from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import json
import re
from typing import List
from pydantic import BaseModel
import datetime

import models
import schemas
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

# Auto-seed if DB is empty
def auto_seed():
    from database import SessionLocal
    db = SessionLocal()
    count = db.query(models.Volunteer).count()
    db.close()
    if count == 0:
        print("🌱 Empty database detected — auto-seeding...")
        import seed
        seed.seed()
        print("✅ Auto-seed complete!")

auto_seed()

app = FastAPI(title="SangamSync Command Center API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# LOCAL INTELLIGENT INCIDENT CLASSIFIER
# ─────────────────────────────────────────────

INCIDENT_RULES = [
    {
        "type": "Medical Emergency",
        "priority": "Critical",
        "keywords": ["medical", "unconscious", "injured", "ambulance", "doctor", "hurt", "bleeding",
                     "fainted", "heart", "breathing", "accident", "pain", "hospital", "चिकित्सा", "बेहोश"],
        "required_skills": ["Medical", "First Aid"],
        "required_count": 3,
        "icon": "🏥"
    },
    {
        "type": "Missing Person",
        "priority": "High",
        "keywords": ["missing", "lost", "child", "gone", "disappeared", "found", "separated",
                     "cannot find", "can't find", "बच्चा", "गुम"],
        "required_skills": ["Search & Rescue", "Communication"],
        "required_count": 4,
        "icon": "🔍"
    },
    {
        "type": "Crowd Surge",
        "priority": "High",
        "keywords": ["crowd", "surge", "stampede", "rush", "gathering", "push",
                     "overcrowd", "dense", "mob", "crush", "pressure", "भीड़"],
        "required_skills": ["Crowd Management", "Security"],
        "required_count": 5,
        "icon": "👥"
    },
    {
        "type": "Security Threat",
        "priority": "Critical",
        "keywords": ["fight", "violence", "weapon", "theft", "attack", "robbery",
                     "threat", "suspect", "conflict", "assault", "dangerous"],
        "required_skills": ["Security", "Law Enforcement"],
        "required_count": 4,
        "icon": "🚨"
    },
    {
        "type": "Fire Emergency",
        "priority": "Critical",
        "keywords": ["fire", "smoke", "burning", "flame", "blaze", "spark", "explosion", "आग"],
        "required_skills": ["Fire Safety", "Medical"],
        "required_count": 4,
        "icon": "🔥"
    },
    {
        "type": "Infrastructure Failure",
        "priority": "Medium",
        "keywords": ["power", "electricity", "structure", "collapse", "breakdown",
                     "damage", "barrier", "fallen", "broken", "leak"],
        "required_skills": ["Technical", "Logistics"],
        "required_count": 3,
        "icon": "⚠️"
    },
]

SECTOR_DISTANCES = {
    ("Sector 1", "Sector 2"): 1, ("Sector 1", "Sector 3"): 2, ("Sector 1", "Sector 4"): 3,
    ("Sector 1", "Sector 5"): 4, ("Sector 1", "Sector 6"): 5, ("Sector 1", "Sector 7"): 6, ("Sector 1", "Sector 8"): 7,
    ("Sector 2", "Sector 3"): 1, ("Sector 2", "Sector 4"): 2, ("Sector 2", "Sector 5"): 3,
    ("Sector 2", "Sector 6"): 4, ("Sector 2", "Sector 7"): 5, ("Sector 2", "Sector 8"): 6,
    ("Sector 3", "Sector 4"): 1, ("Sector 3", "Sector 5"): 2, ("Sector 3", "Sector 6"): 3,
    ("Sector 3", "Sector 7"): 4, ("Sector 3", "Sector 8"): 5,
    ("Sector 4", "Sector 5"): 1, ("Sector 4", "Sector 6"): 2, ("Sector 4", "Sector 7"): 3, ("Sector 4", "Sector 8"): 4,
    ("Sector 5", "Sector 6"): 1, ("Sector 5", "Sector 7"): 2, ("Sector 5", "Sector 8"): 3,
    ("Sector 6", "Sector 7"): 1, ("Sector 6", "Sector 8"): 2,
    ("Sector 7", "Sector 8"): 1,
}

def get_distance_km(s1: str, s2: str) -> float:
    if s1 == s2:
        return 0
    key = (s1, s2)
    rev = (s2, s1)
    return SECTOR_DISTANCES.get(key, SECTOR_DISTANCES.get(rev, 4))

def get_response_time(distance_km: float) -> str:
    minutes = int(distance_km * 2 + 1)
    return f"{minutes} minute{'s' if minutes != 1 else ''}"

def extract_sector(text: str) -> str:
    text_lower = text.lower()
    match = re.search(r'sector\s+(\d+)', text_lower)
    if match:
        num = int(match.group(1))
        if 1 <= num <= 8:
            return f"Sector {num}"
    match = re.search(r'gate\s+([a-zA-Z0-9]+)', text_lower)
    if match:
        return f"Gate {match.group(1).upper()}"
    return "Sector 1"  # default to sector 1

def classify_incident(text: str) -> dict:
    text_lower = text.lower()
    best_match = None
    best_score = 0
    for rule in INCIDENT_RULES:
        score = sum(1 for kw in rule["keywords"] if kw in text_lower)
        if score > best_score:
            best_score = score
            best_match = rule
    if not best_match or best_score == 0:
        best_match = {
            "type": "General Incident", "priority": "Medium",
            "required_skills": ["General Assistance"], "required_count": 2, "icon": "📋"
        }
    return {
        "incident_type": best_match["type"],
        "priority": best_match["priority"],
        "sector": extract_sector(text),
        "required_skills": best_match["required_skills"],
        "required_count": best_match["required_count"],
        "icon": best_match.get("icon", "📋"),
        "confidence": min(100, best_score * 25 + 40)
    }

def get_selection_reasons(volunteer, incident, v_skills, skill_match, distance_km):
    reasons = []
    if skill_match:
        required_lower = [r.lower() for r in incident.get("required_skills", [])]
        matching = [s for s in v_skills if any(req in s.lower() or s.lower() in req for req in required_lower)]
        if matching:
            reasons.append(f"✓ Skill match: {', '.join(matching)}")
    if distance_km == 0:
        reasons.append("✓ In same sector (immediate response)")
    elif distance_km <= 2:
        reasons.append(f"✓ Nearby — {distance_km}km away")
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
        reasons.append("⚠ High workload")
    if volunteer.consecutive_tasks < 3:
        reasons.append("✓ Low task count")
    return reasons

# ─────────────────────────────────────────────
# API ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "SangamSync API running!", "version": "2.0"}

@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_volunteers = db.query(models.Volunteer).count()
    active_volunteers = db.query(models.Volunteer).filter(models.Volunteer.availability == "Available").count()
    ongoing_incidents = db.query(models.Incident).filter(
        models.Incident.status.in_(["Pending", "In Progress"])
    ).count()
    critical_alerts = db.query(models.Incident).filter(
        models.Incident.priority == "Critical",
        models.Incident.status.in_(["Pending", "In Progress"])
    ).count()

    sectors = ["Sector 1","Sector 2","Sector 3","Sector 4","Sector 5","Sector 6","Sector 7","Sector 8"]
    sector_stats = []
    for sector in sectors:
        total = db.query(models.Volunteer).filter(models.Volunteer.sector == sector).count()
        available = db.query(models.Volunteer).filter(
            models.Volunteer.sector == sector,
            models.Volunteer.availability == "Available"
        ).count()
        coverage = round((available / total) * 100) if total > 0 else 0
        active_incidents = db.query(models.Incident).filter(
            models.Incident.sector == sector,
            models.Incident.status.in_(["Pending", "In Progress"])
        ).count()
        status = "critical" if coverage < 40 or active_incidents >= 3 else "warning" if coverage < 70 or active_incidents >= 1 else "safe"
        sector_stats.append({
            "sector": sector, "available": available, "total": total,
            "coverage": coverage, "status": status, "active_incidents": active_incidents
        })

    # Incident breakdown by type for charts
    incidents_all = db.query(models.Incident).all()
    type_counts = {}
    for inc in incidents_all:
        type_counts[inc.type] = type_counts.get(inc.type, 0) + 1

    return {
        "total_volunteers": total_volunteers,
        "active_volunteers": active_volunteers,
        "ongoing_incidents": ongoing_incidents,
        "critical_alerts": critical_alerts,
        "sector_stats": sector_stats,
        "incident_type_counts": type_counts
    }

@app.get("/api/volunteers", response_model=List[schemas.Volunteer])
def read_volunteers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Volunteer).offset(skip).limit(limit).all()

@app.post("/api/volunteers", response_model=schemas.Volunteer)
def create_volunteer(volunteer: schemas.VolunteerCreate, db: Session = Depends(get_db)):
    skills_json = json.dumps(volunteer.skills) if isinstance(volunteer.skills, list) else volunteer.skills
    db_vol = models.Volunteer(
        name=volunteer.name,
        phone=volunteer.phone,
        sector=volunteer.sector,
        skills=skills_json,
        experience_level=volunteer.experience_level,
        availability="Available",
        hours_worked=0,
        consecutive_tasks=0
    )
    db.add(db_vol)
    db.commit()
    db.refresh(db_vol)
    return db_vol

@app.get("/api/incidents", response_model=List[schemas.Incident])
def read_incidents(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(models.Incident).order_by(models.Incident.created_at.desc()).offset(skip).limit(limit).all()

@app.post("/api/ai/analyze-incident")
def analyze_incident(text: str):
    try:
        return classify_incident(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/allocate-volunteers")
def allocate_volunteers(incident: dict, db: Session = Depends(get_db)):
    volunteers = db.query(models.Volunteer).filter(models.Volunteer.availability == "Available").all()
    required_skills = incident.get("required_skills", [])
    incident_sector = incident.get("sector", "Sector 1")
    scored = []
    for v in volunteers:
        score = 0
        try:
            v_skills = json.loads(v.skills) if isinstance(v.skills, str) else (v.skills or [])
        except:
            v_skills = []
        required_lower = [r.lower() for r in required_skills]
        skill_match = any(
            any(req in skill.lower() or skill.lower() in req for req in required_lower)
            for skill in v_skills
        )
        if skill_match:
            score += 40
        distance_km = get_distance_km(v.sector, incident_sector)
        if distance_km == 0: score += 25
        elif distance_km <= 1: score += 20
        elif distance_km <= 2: score += 15
        elif distance_km <= 3: score += 8
        if v.experience_level == "Expert": score += 10
        elif v.experience_level == "Intermediate": score += 5
        if v.hours_worked < 4: score += 10
        elif v.hours_worked < 8: score += 5
        score += 15
        reasons = get_selection_reasons(v, incident, v_skills, skill_match, distance_km)
        scored.append({
            "volunteer": schemas.Volunteer.model_validate(v),
            "match_score": score,
            "reasons": reasons,
            "response_time": get_response_time(distance_km),
            "distance_km": distance_km
        })
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored[:3]

class DispatchRequest(BaseModel):
    incident_text: str
    incident_data: dict
    volunteer_ids: List[int]

@app.post("/api/dispatch")
def dispatch_team(req: DispatchRequest, db: Session = Depends(get_db)):
    """
    Real dispatch endpoint:
    1. Saves incident to DB
    2. Creates assignments
    3. Marks volunteers as Busy
    4. Updates hours_worked + consecutive_tasks
    """
    # 1. Save incident
    incident = models.Incident(
        description=req.incident_text,
        type=req.incident_data.get("incident_type", "General Incident"),
        priority=req.incident_data.get("priority", "Medium"),
        sector=req.incident_data.get("sector", "Unknown"),
        required_skills=json.dumps(req.incident_data.get("required_skills", [])),
        required_count=req.incident_data.get("required_count", 2),
        status="In Progress"
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # 2. Update each dispatched volunteer
    assignments = []
    for vol_id in req.volunteer_ids:
        volunteer = db.query(models.Volunteer).filter(models.Volunteer.id == vol_id).first()
        if volunteer:
            volunteer.availability = "Busy"
            volunteer.hours_worked += 1.0
            volunteer.consecutive_tasks += 1
            assignment = models.Assignment(
                volunteer_id=vol_id,
                incident_id=incident.id,
                match_score=0,
                status="Active"
            )
            db.add(assignment)
            assignments.append(vol_id)
    db.commit()

    return {
        "success": True,
        "incident_id": incident.id,
        "dispatched_volunteers": assignments,
        "message": f"Team dispatched to {req.incident_data.get('sector')}. Incident #{incident.id} created."
    }

@app.patch("/api/incidents/{incident_id}/resolve")
def resolve_incident(incident_id: int, db: Session = Depends(get_db)):
    """Mark incident resolved and free up volunteers."""
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident.status = "Resolved"
    # Free volunteers assigned to this incident
    assignments = db.query(models.Assignment).filter(
        models.Assignment.incident_id == incident_id,
        models.Assignment.status == "Active"
    ).all()
    for a in assignments:
        a.status = "Completed"
        vol = db.query(models.Volunteer).filter(models.Volunteer.id == a.volunteer_id).first()
        if vol:
            vol.availability = "Available"
    db.commit()
    return {"success": True, "message": f"Incident #{incident_id} resolved. Volunteers freed."}

@app.post("/api/burnout/replace/{volunteer_id}")
def suggest_replacement(volunteer_id: int, db: Session = Depends(get_db)):
    """Find the best replacement for a burned-out volunteer."""
    burned = db.query(models.Volunteer).filter(models.Volunteer.id == volunteer_id).first()
    if not burned:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    try:
        burned_skills = json.loads(burned.skills) if isinstance(burned.skills, str) else (burned.skills or [])
    except:
        burned_skills = []
    candidates = db.query(models.Volunteer).filter(
        models.Volunteer.id != volunteer_id,
        models.Volunteer.availability == "Available",
        models.Volunteer.hours_worked < 8
    ).all()
    best = None
    best_score = -1
    for c in candidates:
        try:
            c_skills = json.loads(c.skills) if isinstance(c.skills, str) else (c.skills or [])
        except:
            c_skills = []
        skill_overlap = len(set(burned_skills) & set(c_skills))
        sector_bonus = 10 if c.sector == burned.sector else 0
        score = skill_overlap * 5 + sector_bonus - c.hours_worked
        if score > best_score:
            best_score = score
            best = c
    if not best:
        raise HTTPException(status_code=404, detail="No suitable replacement found")
    return {
        "replacement": schemas.Volunteer.model_validate(best),
        "burned_volunteer": schemas.Volunteer.model_validate(burned),
        "reason": f"Replace {burned.name} ({burned.hours_worked}h worked) with {best.name} ({best.hours_worked}h worked, same skill overlap)"
    }
