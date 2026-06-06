"""
SangamSync Database Seeder
Seeds 50 realistic volunteers with consistent data that matches the classifier.
Run: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine
import models
import json
import random

models.Base.metadata.create_all(bind=engine)

# Sectors: 1-8 (consistent across entire app)
SECTORS = ["Sector 1", "Sector 2", "Sector 3", "Sector 4",
           "Sector 5", "Sector 6", "Sector 7", "Sector 8"]

# Skills: EXACTLY matching INCIDENT_RULES in main.py
SKILL_POOL = [
    "Medical", "First Aid",
    "Search & Rescue", "Communication",
    "Crowd Management", "Security",
    "Law Enforcement",
    "Fire Safety",
    "Technical", "Logistics",
    "General Assistance"
]

EXPERIENCE_LEVELS = ["Trainee", "Intermediate", "Expert"]

NAMES = [
    "Rahul Sharma", "Priya Singh", "Amit Kumar", "Sunita Devi", "Rajesh Gupta",
    "Kavita Mishra", "Vikram Yadav", "Anjali Verma", "Suresh Patel", "Pooja Tiwari",
    "Dinesh Chauhan", "Meena Rani", "Anil Shukla", "Geeta Kumari", "Ramesh Dubey",
    "Sita Pandey", "Mahesh Tripathi", "Lata Joshi", "Vinod Srivastava", "Rekha Aggarwal",
    "Prakash Nair", "Shanti Rao", "Deepak Pillai", "Usha Menon", "Girish Iyer",
    "Lakshmi Krishnan", "Sandeep Bose", "Rupa Das", "Tapan Ghosh", "Mala Banerjee",
    "Harish Reddy", "Sudha Naidu", "Venkat Rao", "Padma Krishnamurthy", "Srikanth Murthy",
    "Shyam Lal", "Kamla Devi", "Bharat Singh", "Durga Prasad", "Champa Devi",
    "Arjun Tomar", "Savita Chahal", "Mohan Rawat", "Asha Bisht", "Gopal Negi",
    "Chandra Bala", "Hemant Saxena", "Pushpa Rani", "Naresh Bajpai", "Radha Pathak"
]

def generate_phone(idx):
    return f"98{idx:08d}"

def generate_skills():
    """Give each volunteer 2-4 skills from the pool."""
    count = random.randint(2, 4)
    return random.sample(SKILL_POOL, count)

def seed():
    db = SessionLocal()
    
    # Clear existing data
    db.query(models.Assignment).delete()
    db.query(models.Incident).delete()
    db.query(models.Volunteer).delete()
    db.commit()
    
    volunteers = []
    for i, name in enumerate(NAMES):
        skills = generate_skills()
        sector = SECTORS[i % len(SECTORS)]
        experience = EXPERIENCE_LEVELS[i % len(EXPERIENCE_LEVELS)]
        
        vol = models.Volunteer(
            name=name,
            phone=generate_phone(i + 1),
            sector=sector,
            skills=json.dumps(skills),
            experience_level=experience,
            availability="Available",
            hours_worked=round(random.uniform(0, 11), 1),
            consecutive_tasks=random.randint(0, 6)
        )
        volunteers.append(vol)
        db.add(vol)
    
    db.commit()
    print(f"[OK] Seeded {len(volunteers)} volunteers successfully!")
    
    # Print a summary
    for sector in SECTORS:
        count = sum(1 for v in volunteers if v.sector == sector)
        print(f"   {sector}: {count} volunteers")
    
    db.close()

if __name__ == "__main__":
    seed()
