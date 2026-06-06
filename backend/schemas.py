from pydantic import BaseModel
from typing import List, Optional
import datetime

class VolunteerBase(BaseModel):
    name: str
    phone: str
    sector: str
    skills: str # JSON string of list
    experience_level: str
    availability: str = "Available"

class VolunteerCreate(VolunteerBase):
    pass

class Volunteer(VolunteerBase):
    id: int
    hours_worked: float
    consecutive_tasks: int

    class Config:
        from_attributes = True

class IncidentBase(BaseModel):
    description: str
    type: str
    priority: str
    sector: str
    required_skills: str # JSON string of list
    required_count: int = 1

class IncidentCreate(IncidentBase):
    pass

class Incident(IncidentBase):
    id: int
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AssignmentBase(BaseModel):
    volunteer_id: int
    incident_id: int
    match_score: float

class AssignmentCreate(AssignmentBase):
    pass

class Assignment(AssignmentBase):
    id: int
    status: str
    assigned_at: datetime.datetime
    volunteer: Volunteer
    incident: Incident

    class Config:
        from_attributes = True
