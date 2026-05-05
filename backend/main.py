from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import models
from pydantic import BaseModel
from typing import List, Optional
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hardware AI Roadmap Tracker")

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (can be restricted to Vercel URL later)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

Base.metadata.create_all(bind=engine)

# --- AUTHENTICATION SETUP ---
SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-local-key-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week expiration

# Default password for local testing is "admin". 
# In production, set the MASTER_PASSWORD_HASH env var.
DEFAULT_HASH = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"
MASTER_PASSWORD_HASH = os.getenv("MASTER_PASSWORD_HASH", DEFAULT_HASH)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

@app.post("/api/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if not verify_password(form_data.password, MASTER_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": "admin"}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- MODELS ---
class BenchmarkCreate(BaseModel):
    power_mw: float
    area_luts: int
    area_dsps: int
    timing_slack_ns: float

class WeekCompleteRequest(BaseModel):
    deliverable_link: str

# --- ENDPOINTS ---
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    if db.query(models.Week).count() == 0:
        weeks = []
        for i in range(1, 13):
            # Only week 1 is in progress by default
            w_status = models.WeekStatus.IN_PROGRESS if i == 1 else models.WeekStatus.LOCKED
            weeks.append(models.Week(id=i, title=f"Week {i}", status=w_status))
        db.add_all(weeks)
        db.commit()

# Notice that Depends(get_current_user) is added to protect the endpoints!
@app.get("/api/roadmap")
def get_roadmap(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    weeks = db.query(models.Week).order_by(models.Week.id).all()
    return weeks

@app.post("/api/weeks/{week_id}/complete")
def complete_week(week_id: int, request: WeekCompleteRequest, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    if not request.deliverable_link:
        raise HTTPException(status_code=400, detail="deliverable_link is required")
        
    week = db.query(models.Week).filter(models.Week.id == week_id).first()
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
        
    if week_id > 1:
        prev_week = db.query(models.Week).filter(models.Week.id == week_id - 1).first()
        if prev_week.status != models.WeekStatus.COMPLETED:
            raise HTTPException(status_code=400, detail=f"Cannot complete Week {week_id} because Week {week_id - 1} is not complete.")
            
    week.status = models.WeekStatus.COMPLETED
    week.deliverable_link = request.deliverable_link
    
    if week_id < 12:
        next_week = db.query(models.Week).filter(models.Week.id == week_id + 1).first()
        if next_week and next_week.status == models.WeekStatus.LOCKED:
            next_week.status = models.WeekStatus.IN_PROGRESS
            
    db.commit()
    return {"message": f"Week {week_id} marked as complete"}

@app.post("/api/weeks/{week_id}/benchmarks")
def add_benchmarks(week_id: int, benchmark: BenchmarkCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    week = db.query(models.Week).filter(models.Week.id == week_id).first()
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
        
    new_bench = models.Benchmark(
        week_id=week_id,
        power_mw=benchmark.power_mw,
        area_luts=benchmark.area_luts,
        area_dsps=benchmark.area_dsps,
        timing_slack_ns=benchmark.timing_slack_ns
    )
    db.add(new_bench)
    db.commit()
    db.refresh(new_bench)
    return new_bench
