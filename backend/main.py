from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import google.generativeai as genai
import os
import json
from typing import List

import models
import schemas
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SangamSync Command Center API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini
# Replace with actual API key later or set in environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE")
genai.configure(api_key=GEMINI_API_KEY)

@app.get("/")
def read_root():
    return {"message": "SangamSync API is running!"}

@app.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_volunteers = db.query(models.Volunteer).count()
    active_volunteers = db.query(models.Volunteer).filter(models.Volunteer.availability == "Available").count()
    ongoing_incidents = db.query(models.Incident).filter(models.Incident.status.in_(["Pending", "In Progress"])).count()
    critical_alerts = db.query(models.Incident).filter(models.Incident.priority == "Critical").count()
    
    return {
        "total_volunteers": total_volunteers,
        "active_volunteers": active_volunteers,
        "ongoing_incidents": ongoing_incidents,
        "critical_alerts": critical_alerts
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
    try:
        model = genai.GenerativeModel('gemini-1.5-pro')
        prompt = f"""
        Analyze the following emergency text from Mahakumbh and output ONLY a valid JSON object.
        Do not include markdown blocks like ```json. Just raw JSON.
        Required fields:
        - "incident_type" (e.g., "Medical Emergency", "Missing Child", "Crowd Surge", "Security Threat")
        - "priority" ("Low", "Medium", "High", "Critical")
        - "sector" (Extract if mentioned, e.g. "Sector 3", "Sector A". Default "Unknown")
        - "required_skills" (List of strings, e.g. ["Medical", "Crowd Management"])
        - "required_count" (Integer, default 2)
        
        Text: "{text}"
        """
        response = model.generate_content(prompt)
        # Clean response in case there are markdown ticks
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(clean_text)
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/allocate-volunteers")
def allocate_volunteers(incident: dict, db: Session = Depends(get_db)):
    # Very basic Smart Allocation Engine
    # Real implementation would use geolocation data. For now, we simulate matching.
    volunteers = db.query(models.Volunteer).filter(models.Volunteer.availability == "Available").all()
    
    required_skills = set(incident.get("required_skills", []))
    incident_sector = incident.get("sector", "Unknown")
    
    scored_volunteers = []
    
    for v in volunteers:
        score = 0
        v_skills = set(v.get_skills_list())
        
        # Skill Match = 40%
        if required_skills.intersection(v_skills):
            score += 40
        
        # Distance (Sector Match) = 25%
        if v.sector == incident_sector:
            score += 25
            
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
            
        # Availability is already filtered (15% base score for being available)
        score += 15
        
        scored_volunteers.append({
            "volunteer": schemas.Volunteer.from_orm(v),
            "match_score": score
        })
        
    # Sort by score descending
    scored_volunteers.sort(key=lambda x: x["match_score"], reverse=True)
    return scored_volunteers[:3] # Return top 3

class ChatMessage(schemas.BaseModel):
    message: str

@app.post("/api/ai/chat")
def chat_assistant(chat_req: ChatMessage, db: Session = Depends(get_db)):
    try:
        # Provide the AI with some context about the current state
        total_vol = db.query(models.Volunteer).count()
        active_vol = db.query(models.Volunteer).filter(models.Volunteer.availability == "Available").count()
        
        system_prompt = f"""
        You are the SangamSync AI Operations Assistant. You help Mahakumbh administrators manage volunteers and emergencies.
        Current system state:
        - Total Volunteers: {total_vol}
        - Active Volunteers: {active_vol}
        Answer the following query concisely and professionally:
        {chat_req.message}
        """
        
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(system_prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

