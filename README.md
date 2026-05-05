# Hardware AI Roadmap Tracker

A full-stack web application designed for high-stakes hardware development environments to track TPUs, NPUs, and interconnect roadmaps. Built with a "Cyber-Industrial" design aesthetic.

## Features

- **Strict Roadmap Progression ("The One Rule"):** A 12-week tracked roadmap that mathematically enforces progression. Week N+1 remains locked in both the UI and the Backend API until Week N is completed with a valid proof-of-work link.
- **Silicon Bench Integration:** Weekly deliverables require benchmarking metrics (Power [mW], Area [LUTs/DSPs], Timing Slack [ns]) to validate hardware performance.
- **Cyber-Industrial UI:** A highly specialized, data-dense interface tailored for engineering clarity, utilizing a custom color palette, terminal typography (JetBrains Mono), and luminescent accents.
- **Secure Authentication:** Protected by an industry-standard JWT authentication layer and a secure Master Password.

## Technology Stack

- **Frontend:** React (TypeScript via Vite), Tailwind CSS
- **Backend:** Python, FastAPI, SQLAlchemy, Pydantic, Bcrypt (JWT Authentication)
- **Database:** PostgreSQL (Configurable to SQLite for local testing)
- **UI Design System:** Stitch MCP

## Getting Started Locally

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
*Note: The backend will automatically create the database tables and seed the 12-week roadmap on the first run. For local testing, the default Master Password is `admin`.*

### 2. Frontend Setup

Navigate to the `frontend` directory, install Node dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

## Deployment Guide (Render + Vercel)

### 1. Generating Your Secure Hash
Before deploying, generate a bcrypt hash for your chosen Master Password to keep your API secure:
```bash
cd backend
python generate_hash.py
```
Save the generated `MASTER_PASSWORD_HASH` output.

### 2. Deploy Backend (Render)
1. Create a PostgreSQL Database on Render.
2. Create a Web Service for the `backend` folder.
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Required Environment Variables:**
   - `DATABASE_URL`: Your Render Postgres Internal URL.
   - `SECRET_KEY`: A long, random string.
   - `MASTER_PASSWORD_HASH`: The hash you generated in step 1.

### 3. Deploy Frontend (Vercel)
1. Import your GitHub repository to Vercel.
2. Set the **Root Directory** to `frontend`.
3. Set the **Framework Preset** to `Vite`.
4. **Required Environment Variable:**
   - `VITE_API_BASE_URL`: Your live Render backend URL (e.g., `https://my-backend.onrender.com`).

## Design

The comprehensive design system rules, including color tokens, typography, and shape language, are documented in `DESIGN.md`.
