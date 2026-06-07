# 🕉️ SangamSync

### Smart Volunteer Deployment & Workforce Optimization for Mahakumbh

<div align="center">

![SangamSync](https://img.shields.io/badge/SangamSync-Command%20Center-6366f1?style=for-the-badge)
![Hackathon](https://img.shields.io/badge/Mahakumbh-Innovation%20Hackathon%202028-f59e0b?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Deployed](https://img.shields.io/badge/Status-Live%20on%20Vercel%20%2B%20Render-22c55e?style=for-the-badge)

**"Right Volunteer. Right Place. Right Time."**

*Round 2 Submission — AI-Assisted Product Build Challenge*  
*Expert Hire × VIT Bhopal — Mahakumbh Madhya Pradesh 2028*

**👤 Author:** [Mayank (@mayankjhn)](https://github.com/mayankjhn) ·

### 🔗 Quick Links

| | Link |
|---|------|
| 🌐 **Live Demo** | [https://sangamsync.vercel.app](https://sangamsync.vercel.app) *(update with your URL)* |
| 🎥 **Demo Video** | [Loom Recording](https://loom.com) *(add your Loom link)* |
| 📂 **GitHub** | [github.com/mayankjhn/SangamSync](https://github.com/mayankjhn/SangamSync) |
| 📡 **API Docs** | [Render API /docs](https://sangamsync-api.onrender.com/docs) *(update with your URL)* |

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Complete Workflow](#-complete-workflow)
- [Intelligence Engine](#-intelligence-engine)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Reference](#️-api-reference)
- [Database Schema](#️-database-schema)
- [Hackathon Submission](#-hackathon-submission)
- [Future Roadmap](#-future-roadmap)
- [License & Acknowledgements](#-license--acknowledgements)

---

## 🌟 Overview

**SangamSync** is a full-stack **Volunteer Command Center** built for the **Mahakumbh Innovation Hackathon 2028** (Track: *Smart Volunteer Deployment & Workforce Optimization*).

It helps authorities **recruit, manage, allocate, monitor, and optimize** thousands of volunteers during Mahakumbh — using **skills, location, workload, and operational requirements**.

> **Core differentiator:** Explainable, offline-reliable dispatch — not a black-box chatbot. Every volunteer recommendation comes with human-readable reasons, match scores, and estimated response time.

---

## 🎯 Problem Statement

**Mahakumbh** is the world's largest human gathering:

| Metric | Scale |
|--------|-------|
| Pilgrims Expected | 400–450 Million |
| Duration | ~45 days |
| Area | 4,000+ hectares |
| Volunteers | 10,000+ |
| Operational Zones | 25+ sectors |

### Current Challenges

- 🔴 **Manual allocation** — 10–20 minutes per incident via phone calls
- 🔴 **No real-time visibility** — who is available, where, and at what capacity
- 🔴 **Poor skill matching** — wrong volunteers sent to wrong incidents
- 🔴 **Burnout undetected** — overworked volunteers make critical mistakes
- 🔴 **Sector imbalances** — some zones over-staffed, others in crisis
- 🔴 **No explainability** — commanders can't verify *why* someone was chosen

---

## 💡 Solution

SangamSync is a real-time command center that closes the full ops loop:

| Capability | What SangamSync Does |
|------------|----------------------|
| **Recruit** | In-app volunteer registration with skills & sector |
| **Manage** | Searchable registry with live availability status |
| **Allocate** | Weighted scoring engine → top 3 explainable matches |
| **Monitor** | Live dashboards, sector heatmap, incident history |
| **Optimize** | Burnout detection + one-click replacement suggestions |

**Design philosophy:** *A system that works 100% of the time beats a system that is "smarter" 80% of the time.*

The intelligence engine runs **locally** — no external AI API required for core dispatch.

---

## ✨ Key Features

### 🚨 1. Emergency Dispatch Terminal
Type an incident in plain **Hindi or English**:

```
Medical emergency at Sector 3 — person unconscious near the main ghat
```

The system instantly:
- Classifies type, priority, sector, and required skills
- Ranks the **top 3 volunteers** with match scores
- Shows **explainable reasons** and **ETA**
- **Persists dispatch** to database on confirmation

### 🧠 2. Intelligent Incident Classifier
Rule-based NLP — instant, offline, zero API cost.

| Keywords | Type | Priority |
|----------|------|----------|
| medical, unconscious, injured, चिकित्सा | Medical Emergency | Critical |
| missing, lost, child, बच्चा, गुम | Missing Person | High |
| crowd, surge, stampede, भीड़ | Crowd Surge | High |
| fight, violence, weapon | Security Threat | Critical |
| fire, smoke, burning, आग | Fire Emergency | Critical |
| power, collapse, broken | Infrastructure Failure | Medium |

### 📊 3. Smart Allocation with Explainability

```
#1 Rahul Sharma — 96% Match
  ✓ Skill match: Medical, First Aid
  ✓ In same sector (immediate response)
  ✓ Expert level volunteer
  ✓ Fresh — low workload
  ⏱ ETA: 1 minute
```

### 📋 4. Incident History & Resolve
- All dispatched incidents saved with timestamps
- Resolve incidents → volunteers automatically freed
- Auto-refreshes every 10 seconds

### 🗺️ 5. Live Sector Heatmap
Real-time coverage across **Sector 1–8**:
- 🟢 **Safe** — coverage > 70%
- 🟡 **Warning** — coverage 40–70% or active incidents
- 🔴 **Critical** — coverage < 40% or 3+ incidents

### 📈 6. Analytics Dashboard
- Total / active volunteers
- Open incidents & critical alerts
- Volunteer distribution pie chart (live)
- Incidents-by-type bar chart (live)

### 👥 7. Volunteer Recruitment & Registry
- Register new volunteers (name, phone, sector, skills, experience)
- Search by name, phone, or skill
- Filter by sector

### 🔥 8. Burnout Detection & Replacement
| Hours Worked | Risk | Action |
|-------------|------|--------|
| > 10h | 🔴 High | Suggest Replacement (live API) |
| 7–10h | 🟡 Medium | Monitor |
| < 7h | 🟢 Low | Deploy freely |

### 📡 9. Operations Status Board
Live sector coverage matrix, system health indicators, real-time clock.

---

## 🔄 Complete Workflow

```
Incident Report (Hindi/English text)
        │
        ▼
  Classify Incident ──► type · priority · sector · skills
        │
        ▼
  Score Volunteers ──► skills + proximity + experience + workload
        │
        ▼
  Top 3 Matches ──► scores + reasons + ETA
        │
        ▼
  Commander Dispatches ──► saved to DB
        │
        ├──► Volunteers marked Busy, workload updated
        ├──► Overview & Heatmap refresh
        ├──► Incident History updated
        │
        ▼
  Resolve Incident ──► volunteers freed, status = Resolved
```

---

## 🧠 Intelligence Engine

### Scoring Formula

```
Score = Skill Match (40%) + Proximity (25%) + Availability (15%)
      + Experience (10%) + Workload (10%)

Maximum = 100 points
```

| Factor | Scoring |
|--------|---------|
| **Proximity** | Same sector: 25pts · ≤1km: 20 · ≤2km: 15 · ≤3km: 8 |
| **Experience** | Expert: 10pts · Intermediate: 5 · Trainee: 0 |
| **Workload** | <4h: 10pts · 4–8h: 5 · >8h: 0 |

Sectors use a **distance matrix** across Sector 1–8 for proximity calculation.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vercel)                        │
│  React 18 · Vite · Tailwind · Framer Motion · Recharts       │
│                                                              │
│  Auth → Overview → Dispatch → Heatmap → Burnout              │
│  Volunteers → Incident History → Ops Status Board            │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (VITE_API_URL)
┌──────────────────────────▼──────────────────────────────────┐
│                     BACKEND (Render)                            │
│  FastAPI · SQLAlchemy · SQLite · Auto-seed on startup          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Local Intelligence Engine                   │   │
│  │  Incident Classifier │ Allocation Engine │ Burnout API  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Volunteers │ Incidents │ Assignments (with match scores)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | React 18 + Vite | Fast, modern dashboards |
| Styling | Tailwind CSS 4 | Command-center UI at speed |
| Charts | Recharts | Live ops analytics |
| Animations | Framer Motion | Polished demo UX |
| Backend | FastAPI (Python) | Fast APIs + auto docs |
| Database | SQLite + SQLAlchemy | Zero-config, offline-ready |
| Deploy | Vercel + Render | Free public demo for judges |
| Dev Tool | **Cursor AI** | AI-assisted full-stack build |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### 1. Clone

```bash
git clone https://github.com/mayankjhn/SangamSync.git
cd SangamSync
```

### 2. Backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python seed.py          # optional — auto-seeds on first server start
uvicorn main:app --reload --port 8000
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173
- Opens at `/auth` → click **Admin (Control Room)**

### 4. Try a Demo Incident

Navigate to **Emergency Dispatch** and type:

```
Medical emergency at Sector 3 — person unconscious
```

Click **Analyze & Allocate** → **Dispatch Team Now** → check **Incident History**.

---

## 🌐 Deployment

### Backend — Render

1. Push repo to GitHub
2. [Render](https://render.com) → New Web Service → connect repo
3. **Root Directory:** `backend`
4. **Build:** `pip install -r requirements.txt`
5. **Start:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

Or use the included [`render.yaml`](render.yaml).

### Frontend — Vercel

1. [Vercel](https://vercel.com) → Import repo
2. **Root Directory:** `frontend`
3. **Environment Variable:**

```
VITE_API_URL=https://your-backend.onrender.com
```

4. Deploy

Includes [`frontend/vercel.json`](frontend/vercel.json) for SPA routing.

> **Note:** Render free tier may cold-start (~30s). DB auto-seeds on each fresh deploy.

---

## 📁 Project Structure

```
SangamSync/
├── backend/
│   ├── main.py           # API + intelligence engine + dispatch
│   ├── models.py         # Volunteer, Incident, Assignment models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # SQLite connection
│   ├── seed.py           # 50 volunteers across Sector 1–8
│   └── requirements.txt  # fastapi, uvicorn, sqlalchemy, pydantic
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx         # Entry / role selection
│   │   │   ├── Dashboard.jsx    # Sidebar layout
│   │   │   ├── Overview.jsx     # Live analytics
│   │   │   ├── Dispatch.jsx     # Emergency dispatch terminal
│   │   │   ├── Heatmap.jsx      # Sector coverage heatmap
│   │   │   ├── Burnout.jsx      # Burnout + replacement
│   │   │   ├── Volunteers.jsx   # Registration + registry
│   │   │   ├── Incidents.jsx    # Incident history + resolve
│   │   │   └── Chat.jsx         # Ops status board
│   │   └── lib/
│   │       └── api.js           # Axios client (env-based URL)
│   ├── vercel.json
│   └── .env.example
├── render.yaml
└── README.md
```

---

## 🗺️ API Reference

**Base URL:** `http://localhost:8000` (local) or your Render URL (production)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/dashboard/stats` | Live stats, sector health, incident charts |
| `GET` | `/api/volunteers` | List all volunteers |
| `POST` | `/api/volunteers` | Register a new volunteer |
| `GET` | `/api/incidents` | List incidents (newest first) |
| `POST` | `/api/ai/analyze-incident?text=...` | Classify incident (Hindi + English) |
| `POST` | `/api/ai/allocate-volunteers` | Get top 3 ranked volunteers |
| `POST` | `/api/dispatch` | Save incident, assign team, update workload |
| `PATCH` | `/api/incidents/{id}/resolve` | Resolve incident, free volunteers |
| `POST` | `/api/burnout/replace/{id}` | Suggest burnout replacement |

### Example — Analyze Incident

```bash
POST /api/ai/analyze-incident?text=Medical%20emergency%20at%20Sector%203%20unconscious
```

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

### Example — Dispatch Team

```bash
POST /api/dispatch
Content-Type: application/json

{
  "incident_text": "Medical emergency at Sector 3 — person unconscious",
  "incident_data": {
    "incident_type": "Medical Emergency",
    "priority": "Critical",
    "sector": "Sector 3",
    "required_skills": ["Medical", "First Aid"],
    "required_count": 3
  },
  "volunteer_ids": [3, 11, 27],
  "volunteer_scores": { "3": 96, "11": 89, "27": 82 }
}
```

```json
{
  "success": true,
  "incident_id": 1,
  "dispatched_volunteers": [3, 11, 27],
  "message": "Team dispatched to Sector 3. Incident #1 created."
}
```

Interactive docs: **/docs**

---

## 🗂️ Database Schema

### `volunteers`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| name | TEXT | |
| phone | TEXT | |
| sector | TEXT | Sector 1 – Sector 8 |
| skills | TEXT | JSON array |
| experience_level | TEXT | Trainee / Intermediate / Expert |
| availability | TEXT | Available / Busy / Offline |
| hours_worked | FLOAT | |
| consecutive_tasks | INTEGER | |

### `incidents`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| description | TEXT | Original incident text |
| type | TEXT | Medical Emergency, etc. |
| priority | TEXT | Low / Medium / High / Critical |
| sector | TEXT | |
| status | TEXT | Pending / In Progress / Resolved |
| created_at | DATETIME | |

### `assignments`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| volunteer_id | INTEGER FK | |
| incident_id | INTEGER FK | |
| match_score | FLOAT | Actual allocation score |
| status | TEXT | Active / Completed |
| assigned_at | DATETIME | |

---

## 🏆 Hackathon Submission

**Event:** Mahakumbh Innovation Hackathon 2028 — Round 2  
**Organizers:** Expert Hire × VIT Bhopal  
**Track:** Smart Volunteer Deployment & Workforce Optimization  
**Round:** AI-Assisted Product Build Challenge

| Criterion | How SangamSync Delivers |
|-----------|-------------------------|
| **Problem fit** | Full recruit → manage → allocate → monitor → optimize loop |
| **Innovation** | Explainable allocation + offline-reliable intelligence |
| **Execution** | Live deployed app with persistent dispatch |
| **Usability** | Command-center UI, 9 integrated pages |
| **AI-assisted build** | Built end-to-end with Cursor |
| **Impact** | 15-min manual dispatch → <10 second decision |

### Demo Script (Quick)

1. `/auth` → Admin Control Room
2. **Overview** — 50 volunteers live
3. **Emergency Dispatch** — medical incident Sector 3 → dispatch
4. **Incident History** — verify saved incident
5. **Heatmap** — sector coverage updated
6. **Volunteers** — register new volunteer
7. **Burnout** — suggest replacement
8. **Resolve** incident → volunteers freed

---

## 🔮 Future Roadmap

- [x] Hindi incident keywords
- [x] Persistent dispatch with match scores
- [x] Incident history + resolve
- [x] Volunteer registration UI
- [x] Live deployment (Vercel + Render)
- [ ] Real-time WebSockets for push alerts
- [ ] Mobile volunteer app (React Native)
- [ ] GPS-based proximity (replace sector matrix)
- [ ] WhatsApp dispatch notifications
- [ ] Shift scheduling & rotation
- [ ] Full Hindi UI localization
- [ ] PostgreSQL for production scale

---

## 📄 License & Acknowledgements

**License:** MIT — see [LICENSE](LICENSE)

**Built with ❤️ by [Mayank](https://github.com/mayankjhn) for Mahakumbh Madhya Pradesh 2028**

**Acknowledgements:**
- Expert Hire & VIT Bhopal — Mahakumbh Innovation Hackathon 2028
- [Cursor](https://cursor.com) — AI-assisted development
- [FastAPI](https://fastapi.tiangolo.com/) · [React](https://react.dev/) · [Vite](https://vitejs.dev/) · [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**🏆 SangamSync**

*Intelligent. Reliable. Fast. For the world's largest gathering.*

[![GitHub](https://img.shields.io/badge/GitHub-mayankjhn%2FSangamSync-181717?style=for-the-badge&logo=github)](https://github.com/mayankjhn/SangamSync)

</div>
