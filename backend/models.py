from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
import datetime
from database import Base
import json

class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String)
    sector = Column(String, index=True)
    skills = Column(Text) # Store as JSON string
    experience_level = Column(String) # Beginner, Intermediate, Expert
    availability = Column(String, default="Available") # Available, Busy, Offline
    hours_worked = Column(Float, default=0.0)
    consecutive_tasks = Column(Integer, default=0)
    
    assignments = relationship("Assignment", back_populates="volunteer")

    def get_skills_list(self):
        try:
            return json.loads(self.skills)
        except:
            return []

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text)
    type = Column(String, index=True) # Medical Emergency, Missing Child, etc.
    priority = Column(String) # Low, Medium, High, Critical
    sector = Column(String, index=True)
    required_skills = Column(Text) # Store as JSON string
    required_count = Column(Integer, default=1)
    status = Column(String, default="Pending") # Pending, Assigned, In Progress, Resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    assignments = relationship("Assignment", back_populates="incident")

    def get_required_skills_list(self):
        try:
            return json.loads(self.required_skills)
        except:
            return []

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id"))
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    status = Column(String, default="Assigned") # Assigned, Accepted, In Progress, Completed, Declined
    match_score = Column(Float)
    assigned_at = Column(DateTime, default=datetime.datetime.utcnow)

    volunteer = relationship("Volunteer", back_populates="assignments")
    incident = relationship("Incident", back_populates="assignments")
