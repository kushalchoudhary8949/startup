# 🚀 Startup Detector

> Validate your startup idea before building it — market analysis, competitor intel, and MVP roadmap in seconds.

---

## Project Structure

```
startup-detector/
├── backend/
│   ├── controllers/
│   │   └── analyzeController.js
│   ├── routes/
│   │   └── analyze.js
│   ├── services/
│   │   └── openaiService.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── IdeaInput.jsx
    │   │   ├── AnalysisResult.jsx
    │   │   ├── CompetitorList.jsx
    │   │   └── MVPPlan.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS + Vite |
| Backend | Node.js + Express |
| AI | OpenAI GPT-4o |
| HTTP Client | Axios |

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- An OpenAI API key (with access to GPT-4o)

---

### 1. Clone / unzip the project

```bash
cd startup-detector
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your OpenAI key:

```
OPENAI_API_KEY=sk-your-real-key-here
PORT=3001
```

Start the backend:

```bash
npm run dev   # development (nodemon)
# or
npm start     # production
```

The API will be running at `http://localhost:3001`

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`

---

## API Reference

### POST /api/analyze

**Request:**
```json
{
  "idea": "AI tool that helps students summarize textbooks"
}
```

**Response:**
```json
{
  "analysis": {
    "problem_score": 8,
    "problem_score_reason": "Students consistently struggle with dense textbook content, and existing solutions are generic rather than education-specific.",
    "market_demand": "High",
    "market_demand_detail": "The EdTech market is growing rapidly with millions of students seeking study aids. AI-powered summarization has clear PMF signals.",
    "build_complexity": "Medium",
    "build_complexity_detail": "Core functionality requires LLM integration, file parsing (PDF/EPUB), and a clean UI. Doable in weeks.",
    "monetization_possibilities": ["Freemium SaaS", "University licensing", "Affiliate with textbook publishers"],
    "risks": [
      { "risk": "Copyright concerns with textbook content", "severity": "High", "mitigation": "Implement user-upload model rather than storing books" },
      { "risk": "Low retention after exam season", "severity": "Medium", "mitigation": "Expand to course notes and research papers" },
      { "risk": "Free alternatives from universities", "severity": "Low", "mitigation": "Offer deeper personalization features" }
    ],
    "verdict": "Good Idea",
    "verdict_summary": "This idea targets a large, proven market with a clear pain point. Focus on college students first, especially STEM majors. The key differentiator should be quiz generation from summaries — that's where competitors are weakest."
  },
  "competitors": [
    {
      "name": "Quizlet",
      "description": "Flashcard and study tool platform used by millions of students globally.",
      "strengths": ["Massive user base", "Proven retention features"],
      "weaknesses": ["No summarization", "Manual flashcard creation"],
      "market_gap": "Quizlet requires manual effort — an AI that auto-generates summaries AND quizzes from uploaded textbooks is a clear gap."
    }
  ],
  "mvp_plan": {
    "core_features": [
      "PDF textbook upload",
      "AI-powered chapter summarization",
      "Auto-generated quiz questions from summary",
      "User dashboard with history"
    ],
    "tech_stack": {
      "frontend": "React + Tailwind — fast to build, great UX",
      "backend": "Node.js + Express — lightweight API",
      "database": "PostgreSQL via Supabase — easy setup, scalable",
      "ai_ml": "OpenAI GPT-4o for summarization and quiz generation",
      "hosting": "Vercel (frontend) + Railway (backend)"
    },
    "roadmap": [
      { "week": "Week 1", "title": "Foundation", "tasks": ["Set up project boilerplate", "Build PDF upload and parsing", "Connect OpenAI summarization"] },
      { "week": "Week 2", "title": "Core Product", "tasks": ["Quiz generation from summaries", "User auth (email/Google)", "Summary history dashboard"] },
      { "week": "Week 3", "title": "Polish", "tasks": ["UI polish and mobile optimization", "Loading states and error handling", "Onboarding flow"] },
      { "week": "Week 4", "title": "Launch", "tasks": ["Beta launch to 50 students", "Feedback collection", "Fix critical bugs, prepare landing page"] }
    ],
    "first_version_scope": "V1 should let a student upload a PDF chapter, receive a clean 300-word summary, and get 5 multiple-choice quiz questions. Exclude flashcards, social features, and mobile apps. Target college STEM students aged 18–24 who have upcoming exams."
  }
}
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `PORT` | Backend port (default: 3001) |

---

## Running Both Services

For convenience, open two terminal windows:

**Terminal 1 (backend):**
```bash
cd backend && npm run dev
```

**Terminal 2 (frontend):**
```bash
cd frontend && npm run dev
```

Then visit `http://localhost:5173`
