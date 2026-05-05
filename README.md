# Hardware AI Roadmap Tracker

A full-stack web application designed for high-stakes hardware development environments to track TPUs, NPUs, and interconnect roadmaps. Built with a "Cyber-Industrial" design aesthetic.

## Features

- **Strict Roadmap Progression ("The One Rule"):** A 12-week tracked roadmap that mathematically enforces progression. Week N+1 remains locked in both the UI and the Backend API until Week N is completed with a valid proof-of-work link.
- **Silicon Bench Integration:** Weekly deliverables require benchmarking metrics (Power [mW], Area [LUTs/DSPs], Timing Slack [ns]) to validate hardware performance.
- **Cyber-Industrial UI:** A highly specialized, data-dense interface tailored for engineering clarity, utilizing a custom color palette, terminal typography (JetBrains Mono), and luminescent accents.

## Technology Stack

- **Frontend:** React (TypeScript via Vite), Tailwind CSS
- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL (Configurable to SQLite for local testing)
- **UI Design System:** Stitch MCP

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- PostgreSQL (or use the SQLite fallback configuration)

### 1. Backend Setup

Navigate to the `backend` directory, set up your Python environment, and start the server:

```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
*Note: The backend will automatically create the database tables and seed the 12-week roadmap on the first run.*

### 2. Frontend Setup

Navigate to the `frontend` directory, install Node dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/roadmap`: Fetch the status of all 12 weeks.
- `POST /api/weeks/{week_id}/complete`: Complete a week (requires `deliverable_link` payload) and unlocks the next week.
- `POST /api/weeks/{week_id}/benchmarks`: Submit Silicon Bench metrics for a specific week.

## Design

The comprehensive design system rules, including color tokens, typography, and shape language, are documented in `DESIGN.md`.
