from pydantic import BaseModel
from typing import List, Optional, Union
import datetime

class VolunteerBase(BaseModel):
    name: str
    phone: str
    sector: str
    skills: Union[List[str], str]  # Accept both list and JSON string
    experience_level: str
    availability: str = "Available"

class VolunteerCreate(VolunteerBase):
    pass

class Volunteer(BaseModel):
    id: int
    name: str
    phone: str
    sector: str
    skills: Union[List[str], str]
    experience_level: str
    availability: str
    hours_worked: float
    consecutive_tasks: int

    class Config:
        from_attributes = True

class IncidentBase(BaseModel):
    description: str
    type: str
    priority: str
    sector: str
    required_skills: Union[List[str], str]
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

    class Config:
        from_attributes = True
