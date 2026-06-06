# 🕉️ SangamSync
### AI-Powered Volunteer Command & Workforce Optimization Platform for Mahakumbh

<div align="center">

![SangamSync Banner](https://img.shields.io/badge/SangamSync-Command%20Center-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiLz48L3N2Zz4=)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-Local%20DB-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**"Right Volunteer. Right Place. Right Time."**

*Built for the Mahakumbh Hackathon — Intelligent Volunteer Management System*

</div>

---

## 📋 Table of Contents

- [🎯 Problem Statement](#-problem-statement)
- [💡 Our Solution](#-our-solution)
- [✨ Key Features](#-key-features)
- [🧠 Intelligence Engine (How it Works)](#-intelligence-engine)
- [📸 Screenshots & Demo Flow](#-demo-flow)
- [🏗️ Architecture](#️-architecture)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [📊 Scoring Algorithm](#-scoring-algorithm)
- [🗺️ API Reference](#️-api-reference)
- [🏆 Hackathon Highlights](#-hackathon-highlights)
- [👨‍💻 Team](#-team)

---

## 🎯 Problem Statement

**Mahakumbh 2025** is the world's largest human gathering:

| Metric | Scale |
|--------|-------|
| Pilgrims Expected | 400–450 Million |
| Duration | 45 days |
| Area | 4,000+ hectares |
| Volunteers | 10,000+ |
| Sectors | 25+ zones |

### Current Challenges

- 🔴 **Manual volunteer allocation** — takes 10–20 minutes per incident
- 🔴 **No real-time visibility** into who is available, where, and at what capacity
- 🔴 **Volunteer burnout** goes undetected — overworked responders make mistakes
- 🔴 **Emergency response is slow** due to poor skill-to-incident matching
- 🔴 **Sector imbalances** — some zones are over-staffed while others have critical gaps
- 🔴 **No explainability** — commanders don't know *why* a volunteer was selected

---

## 💡 Our Solution

**SangamSync** is a real-time, intelligent command center that:

1. **Classifies incidents instantly** using a keyword-rules engine (no internet required)
2. **Recommends the best volunteers** using a weighted multi-factor scoring algorithm
3. **Explains every recommendation** — so commanders trust and verify decisions
4. **Detects burnout** proactively before it causes failures
5. **Monitors sector health** in real-time across all zones
6. **Works 100% offline** — no API dependencies, no quotas, no failures

> **Design Philosophy:** *A system that works 100% of the time beats a system that is "smarter" 80% of the time.*

---

## ✨ Key Features

### 🚨 1. Emergency Dispatch Terminal
The crown jewel of SangamSync. An incident commander types a description in plain language:

```
"Medical emergency at the main ghat — one person unconscious near Sector 3"
```

The system instantly:
- Classifies the incident type (Medical Emergency)
- Determines priority (Critical)
- Extracts location (Sector 3)
- Identifies required skills (Medical, First Aid)
- Recommends the **top 3 best-matched volunteers** with full explanations

---

### 🧠 2. Intelligent Incident Classifier
Built entirely with rule-based NLP — zero API, zero cost, zero failure risk.

| Input Keyword | Detected Type | Priority |
|--------------|---------------|----------|
| medical, unconscious, injured, ambulance | Medical Emergency | Critical |
| missing, lost, child, separated | Missing Person | High |
| crowd, surge, stampede, crush | Crowd Surge | High |
| fight, violence, weapon, theft | Security Threat | Critical |
| fire, smoke, burning, explosion | Fire Emergency | Critical |
| power, collapse, broken, leak | Infrastructure Failure | Medium |

---

### 📊 3. Smart Allocation Engine with Explainability

Every volunteer gets a calculated **match score** and the system tells the commander *why*:

```
#1 Rahul Sharma       96% Match
  ✓ Skill match: Medical, First Aid
  ✓ In same sector (immediate response)
  ✓ Expert level volunteer
  ✓ Fresh — low workload
  ✓ Low consecutive task count
  ⏱ Expected response time: 1 minute
```

```
#2 Priya Singh        89% Match
  ✓ Skill match: Medical
  ✓ Nearby (1km away)
  ✓ Experienced volunteer
  ✓ Fresh — low workload
  ⏱ Expected response time: 3 minutes
```

---

### 🔥 4. Volunteer Burnout Detection
Monitors every volunteer's workload in real-time:

| Hours Worked | Consecutive Tasks | Risk Level | Action |
|-------------|-------------------|------------|--------|
| > 10 hours | Any | 🔴 High Risk | Suggest Replacement |
| 7–10 hours | Any | 🟡 Medium Risk | Monitor |
| < 7 hours | < 3 | 🟢 Low Risk | Deploy freely |

---

### 🗺️ 5. Sector Health Monitor (Heatmap)
Visual grid showing real-time status of every sector:

- 🟢 **Safe** — Coverage > 70% — All good
- 🟡 **Warning** — Coverage 40–70% — Needs attention
- 🔴 **Critical** — Coverage < 40% — Immediate reallocation needed

---

### 📈 6. Analytics Dashboard
At-a-glance command overview:
- Total vs Active volunteers (live count)
- Open incidents tracker
- Critical alert counter
- Volunteer distribution by sector (Pie chart)
- Incident type breakdown (Bar chart)
- Sector coverage matrix

---

### 👥 7. Volunteer Registry
Searchable, filterable directory of all registered volunteers with:
- Name, phone, sector
- Skill certifications
- Experience level (Trainee / Intermediate / Expert)
- Current availability and workload

---

### 📡 8. Operations Status Board
Live command overview:
- Real-time clock
- All system components status
- Sector-by-sector coverage percentages
- Auto-refreshes every 10 seconds

---

## 🧠 Intelligence Engine

### Incident Classification Flow

```
User Input (Plain Text)
        │
        ▼
┌──────────────────────────┐
│   Keyword Matching Rules  │
│                          │
│  "medical" → +1 score    │
│  "unconscious" → +1      │
│  "injured" → +1          │
│  ... (13 keywords)       │
└──────────────┬───────────┘
               │ Best Rule Wins
               ▼
┌──────────────────────────┐
│   Sector Extraction      │
│   (Regex: "Sector X")    │
└──────────────┬───────────┘
               │
               ▼
┌──────────────────────────┐
│   Structured Output      │
│   {                      │
│     type: "Medical..."   │
│     priority: "Critical" │
│     sector: "Sector 3"   │
│     skills: [...]        │
│     confidence: 90%      │
│   }                      │
└──────────────────────────┘
```

### Smart Allocation Scoring Formula

```
Score = (Skill Match × 40%) 
      + (Proximity Score × 25%) 
      + (Availability Base × 15%) 
      + (Experience Level × 10%) 
      + (Workload Score × 10%)

Max Score = 100 points
```

**Proximity Scoring Table:**

| Distance | Points Awarded |
|----------|---------------|
| Same sector (0km) | 25 pts |
| ≤ 1km | 20 pts |
| ≤ 2km | 15 pts |
| ≤ 3km | 8 pts |
| > 3km | 0 pts |

**Experience Scoring:**

| Level | Points |
|-------|--------|
| Expert | 10 pts |
| Intermediate | 5 pts |
| Trainee | 0 pts |

**Workload Scoring:**

| Hours Worked | Points |
|-------------|--------|
| < 4 hours | 10 pts |
| 4–8 hours | 5 pts |
| > 8 hours | 0 pts |

---

## 📸 Demo Flow

Follow these steps for the perfect hackathon demonstration:

### Step 1 — Auth Page
Open [http://localhost:5173](http://localhost:5173)
→ Click **"Admin (Control Room)"**

### Step 2 — Overview Dashboard
- Show the live stats: **50 volunteers**, sector breakdown
- Point to the animated Recharts visualizations

### Step 3 — Emergency Dispatch (The WOW Moment)
Navigate to **Emergency Dispatch** and type:
```
Medical emergency at the main ghat — one person unconscious near Sector 3
```
Click **"Analyze & Allocate"**

Watch as the system:
1. Instantly classifies: **Medical Emergency, Critical, Sector 3**
2. Shows **confidence: 90%**
3. Reveals the top 3 matched volunteers with reasons + expected response time
4. Click **"Dispatch Team Now"**

### Step 4 — Try Different Incident Types

```
# Missing child
A child got separated from parents near Gate 5 entry

# Crowd surge  
Massive crowd pushing near Sector 8, people falling

# Security threat
A fight broke out near Sector 2 parking area, weapons involved

# Fire
Thick smoke coming from food stall in Sector 6
```

### Step 5 — Sector Heatmap
Show the color-coded grid — point to red sectors needing immediate attention

### Step 6 — Burnout Detection
Show the workforce optimization page — demonstrate burnout detection with hours worked

### Step 7 — Operations Status Board
Show real-time sector coverage matrix and system health indicators

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                    BROWSER (CLIENT)                     │
│                                                        │
│  React 18 + Vite  │  Tailwind CSS  │  Framer Motion   │
│  Recharts         │  Lucide Icons  │  React Router    │
│                                                        │
│  Pages:                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Overview  │ │Dispatch  │ │Heatmap   │ │Burnout   │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────┐ ┌──────────┐                             │
│  │Volunteers│ │Ops Board │                             │
│  └──────────┘ └──────────┘                             │
└─────────────────────┬──────────────────────────────────┘
                      │ HTTP/REST (localhost:8000)
                      │
┌─────────────────────▼──────────────────────────────────┐
│                    FASTAPI BACKEND                      │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │         Local Intelligence Engine               │  │
│  │  ┌─────────────────┐  ┌──────────────────────┐  │  │
│  │  │ Incident        │  │ Smart Allocation     │  │  │
│  │  │ Classifier      │  │ Engine               │  │  │
│  │  │ (Keyword Rules) │  │ (Weighted Scoring)   │  │  │
│  │  └─────────────────┘  └──────────────────────┘  │  │
│  │  ┌─────────────────┐  ┌──────────────────────┐  │  │
│  │  │ Sector Distance │  │ Burnout Detection    │  │  │
│  │  │ Matrix          │  │ System               │  │  │
│  │  └─────────────────┘  └──────────────────────┘  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │         SQLAlchemy ORM + SQLite Database        │  │
│  │  Volunteers │ Incidents │ Assignments           │  │
│  └─────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Core language |
| FastAPI | 0.100+ | REST API framework |
| SQLAlchemy | 2.0+ | ORM for database |
| SQLite | Built-in | Local persistent database |
| Pydantic | 2.0+ | Data validation & schemas |
| Uvicorn | Latest | ASGI server |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | Latest | Premium animations |
| Recharts | Latest | Data visualization |
| Axios | Latest | HTTP client |
| React Router | 6 | Client-side routing |
| Lucide React | Latest | Icon library |

### Design Principles
- **Dark mode first** — Command center aesthetic
- **Glassmorphism** — Frosted glass cards
- **Micro-animations** — Every interaction feels alive
- **Responsive** — Works on any screen size

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm / yarn

### 1. Clone the Repository

```bash
git clone https://github.com/mayankjhn/SangamSync.git
cd SangamSync
```

### 2. Setup the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\activate

# Activate it (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv

# Seed the database with 50 mock volunteers
python seed.py

# Start the backend server
uvicorn main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**

API documentation at: **http://localhost:8000/docs**

### 3. Setup the Frontend

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 4. Open in Browser

Navigate to [http://localhost:5173](http://localhost:5173) and click **"Admin (Control Room)"**.

---

## 📁 Project Structure

```
SangamSync/
│
├── backend/                    # FastAPI Python Backend
│   ├── main.py                 # Core API endpoints + Intelligence Engine
│   ├── models.py               # SQLAlchemy database models
│   ├── schemas.py              # Pydantic validation schemas
│   ├── database.py             # Database connection setup
│   ├── seed.py                 # Database seeder (50 volunteers)
│   ├── .env                    # Environment variables (gitignored)
│   └── venv/                   # Python virtual environment
│
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx        # Login / Entry page
│   │   │   ├── Dashboard.jsx   # Main layout with sidebar
│   │   │   ├── Overview.jsx    # Analytics dashboard
│   │   │   ├── Dispatch.jsx    # Emergency dispatch terminal
│   │   │   ├── Heatmap.jsx     # Sector status heatmap
│   │   │   ├── Burnout.jsx     # Workforce optimization
│   │   │   ├── Volunteers.jsx  # Volunteer registry
│   │   │   └── Chat.jsx        # Operations status board
│   │   ├── components/
│   │   │   └── ui/             # Reusable UI components
│   │   │       ├── card.jsx
│   │   │       ├── button.jsx
│   │   │       ├── badge.jsx
│   │   │       └── input.jsx
│   │   ├── lib/
│   │   │   └── utils.js        # Utility functions
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles + Tailwind theme
│   ├── package.json
│   ├── vite.config.js
│   └── postcss.config.js
│
├── .gitignore
└── README.md
```

---

## 📊 Scoring Algorithm

### Full Breakdown

The Smart Allocation Engine evaluates every available volunteer against the incident requirements and produces a score out of 100:

```python
# Pseudocode for the scoring algorithm

def score_volunteer(volunteer, incident):
    score = 0
    
    # 1. SKILL MATCH (40 points)
    # Does the volunteer have any required skills?
    if any(skill in volunteer.skills for skill in incident.required_skills):
        score += 40
    
    # 2. PROXIMITY (25 points)
    # How close is the volunteer to the incident sector?
    distance = get_distance(volunteer.sector, incident.sector)
    if distance == 0:   score += 25   # Same sector
    elif distance <= 1: score += 20   # Very close
    elif distance <= 2: score += 15   # Nearby
    elif distance <= 3: score += 8    # Moderate distance
    
    # 3. AVAILABILITY BASE (15 points)
    # All filtered volunteers are available → base score
    score += 15
    
    # 4. EXPERIENCE (10 points)
    if volunteer.experience == "Expert":       score += 10
    elif volunteer.experience == "Intermediate": score += 5
    
    # 5. WORKLOAD (10 points)
    # Inverse relationship — less hours = higher score
    if volunteer.hours_worked < 4:  score += 10
    elif volunteer.hours_worked < 8: score += 5
    
    return score  # Max: 100
```

### Explainability Output

For each recommended volunteer, the system generates human-readable reasons:

```json
{
  "volunteer": { "name": "Rahul Sharma", "sector": "Sector 3" },
  "match_score": 96,
  "reasons": [
    "✓ Skill match: Medical, First Aid",
    "✓ In same sector (immediate response)",
    "✓ Expert level volunteer",
    "✓ Fresh — low workload",
    "✓ Low consecutive task count"
  ],
  "response_time": "1 minute",
  "distance_km": 0
}
```

---

## 🗺️ API Reference

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/dashboard/stats` | Live statistics + sector health |
| GET | `/api/volunteers` | List all volunteers |
| GET | `/api/incidents` | List all incidents |
| POST | `/api/ai/analyze-incident?text=...` | Classify incident from text |
| POST | `/api/ai/allocate-volunteers` | Get ranked volunteer recommendations |

### Example: Analyze Incident

**Request:**
```bash
POST /api/ai/analyze-incident?text=Medical%20emergency%20near%20Sector%203
```

**Response:**
```json
{
  "incident_type": "Medical Emergency",
  "priority": "Critical",
  "sector": "Sector 3",
  "required_skills": ["Medical", "First Aid"],
  "required_count": 3,
  "icon": "🏥",
  "confidence": 90
}
```

### Example: Allocate Volunteers

**Request:**
```bash
POST /api/ai/allocate-volunteers
Content-Type: application/json

{
  "incident_type": "Medical Emergency",
  "priority": "Critical",
  "sector": "Sector 3",
  "required_skills": ["Medical", "First Aid"]
}
```

**Response:**
```json
[
  {
    "volunteer": { "id": 12, "name": "Rahul Sharma", "sector": "Sector 3", ... },
    "match_score": 96,
    "reasons": ["✓ Skill match: Medical", "✓ In same sector", ...],
    "response_time": "1 minute",
    "distance_km": 0
  }
]
```

### Interactive API Docs

FastAPI auto-generates a full interactive documentation page. Access it at:

👉 [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🏆 Hackathon Highlights

### Why SangamSync Wins

| Judging Criterion | How We Address It |
|------------------|-------------------|
| **Innovation** | Explainable AI recommendations — rare in emergency systems |
| **Feasibility** | 100% offline, SQLite, zero-dependency intelligence engine |
| **Impact** | Directly solves volunteer management crisis at scale |
| **Tech Stack** | Modern: React 18, FastAPI, Framer Motion, Recharts |
| **UI/UX** | Premium dark mode, NASA Command Center aesthetic |
| **Demo Readiness** | Pre-seeded data, works in 2 commands, zero API keys needed |
| **Scalability** | Architecture ready for 10,000+ volunteers, multi-sector |

### Differentiators

✅ **Explainable Decisions** — Unlike a black-box AI, every recommendation comes with human-readable reasons

✅ **Zero API Dependencies** — Works perfectly offline, in remote areas, under any network condition

✅ **Burnout Prevention** — Proactively identifies overworked volunteers before failures happen

✅ **Sector Intelligence** — Real-time coverage gaps identified automatically

✅ **Expected Response Time** — The system calculates and displays how long it will take each volunteer to reach the incident

✅ **Confidence Scoring** — Every classification comes with a confidence percentage

---

## 🗂️ Database Schema

### Volunteer Table
```sql
CREATE TABLE volunteers (
    id              INTEGER PRIMARY KEY,
    name            TEXT NOT NULL,
    phone           TEXT UNIQUE,
    sector          TEXT,           -- e.g. "Sector A"
    skills          TEXT,           -- JSON array: ["Medical", "First Aid"]
    experience_level TEXT,          -- "Trainee" | "Intermediate" | "Expert"
    availability    TEXT DEFAULT "Available",
    hours_worked    FLOAT DEFAULT 0,
    consecutive_tasks INTEGER DEFAULT 0
);
```

### Incident Table
```sql
CREATE TABLE incidents (
    id              INTEGER PRIMARY KEY,
    description     TEXT,
    type            TEXT,
    priority        TEXT,           -- "Low" | "Medium" | "High" | "Critical"
    sector          TEXT,
    required_skills TEXT,           -- JSON array
    required_count  INTEGER,
    status          TEXT DEFAULT "Pending",
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Assignment Table
```sql
CREATE TABLE assignments (
    id              INTEGER PRIMARY KEY,
    volunteer_id    INTEGER REFERENCES volunteers(id),
    incident_id     INTEGER REFERENCES incidents(id),
    match_score     FLOAT,
    status          TEXT DEFAULT "Active",
    assigned_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔮 Future Roadmap

- [ ] **Real-time WebSockets** — Live push notifications for new incidents
- [ ] **Mobile App** — Field volunteer mobile interface (React Native)
- [ ] **GPS Integration** — Real geolocation tracking for volunteers
- [ ] **WhatsApp Bot** — Dispatch notifications via WhatsApp
- [ ] **Shift Scheduling** — Automated shift planning with rotation
- [ ] **Photo Verification** — Volunteer identity verification via camera
- [ ] **Multi-language** — Hindi, English, regional language support
- [ ] **Offline PWA** — Progressive Web App for field use without internet
- [ ] **Historical Analytics** — Incident pattern analysis over time

---

## 👨‍💻 Team

**Built with ❤️ for Mahakumbh 2025**

| Name | Role |
|------|------|
| Mayank | Full Stack Developer, System Architect |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **Mahakumbh Mela Authority** — For inspiring this problem
- **FastAPI** — For making backend development a joy
- **Vite + React** — For blazing-fast frontend development
- **Framer Motion** — For making the UI feel alive
- **Tailwind CSS** — For beautiful styling at speed

---

<div align="center">

**🏆 SangamSync — Built to WIN**

*Intelligent. Reliable. Fast. For the world's largest gathering.*

[![GitHub](https://img.shields.io/badge/GitHub-mayankjhn%2FSangamSync-181717?style=for-the-badge&logo=github)](https://github.com/mayankjhn/SangamSync)

</div>
