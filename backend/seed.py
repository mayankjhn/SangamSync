import json
import random
from database import SessionLocal, engine, Base
import models

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if we already have volunteers
    if db.query(models.Volunteer).first():
        print("Database already seeded.")
        return

    print("Seeding database with 50 volunteers...")
    
    first_names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Ravi", "Kavita", "Suresh", "Pooja", "Arun", "Neha", "Vijay", "Ritu", "Deepak", "Divya", "Sanjay", "Swati", "Rajesh", "Aarti"]
    last_names = ["Sharma", "Verma", "Patel", "Singh", "Kumar", "Gupta", "Mishra", "Das", "Yadav", "Reddy"]
    sectors = ["Sector A", "Sector B", "Sector C", "Sector D", "Sector E"]
    all_skills = ["Medical", "Crowd Management", "Security", "Transport", "Hospitality", "Lost & Found", "Firefighting"]
    experience_levels = ["Beginner", "Intermediate", "Expert"]
    
    for _ in range(50):
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        phone = f"+91 {random.randint(7000000000, 9999999999)}"
        sector = random.choice(sectors)
        
        # Pick 1 to 3 random skills
        skills_count = random.randint(1, 3)
        skills = random.sample(all_skills, skills_count)
        
        experience_level = random.choice(experience_levels)
        
        # Add some variation to workload for burnout simulation
        hours_worked = round(random.uniform(2.0, 12.0), 1)
        consecutive_tasks = random.randint(1, 15)
        
        availability = random.choice(["Available", "Available", "Available", "Busy", "Offline"]) # Bias towards Available
        
        volunteer = models.Volunteer(
            name=name,
            phone=phone,
            sector=sector,
            skills=json.dumps(skills),
            experience_level=experience_level,
            availability=availability,
            hours_worked=hours_worked,
            consecutive_tasks=consecutive_tasks
        )
        db.add(volunteer)
    
    db.commit()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_data()
