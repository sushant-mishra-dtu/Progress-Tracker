from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import models
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Hardware AI Roadmap Tracker")

Base.metadata.create_all(bind=engine)

class BenchmarkCreate(BaseModel):
    power_mw: float
    area_luts: int
    area_dsps: int
    timing_slack_ns: float

class WeekCompleteRequest(BaseModel):
    deliverable_link: str

# Endpoints
@app.on_event("startup")
def startup_event():
    db = next(get_db())
    # Initialize 12 weeks if not present
    if db.query(models.Week).count() == 0:
        weeks = []
        for i in range(1, 13):
            status = models.WeekStatus.IN_PROGRESS if i == 1 else models.WeekStatus.LOCKED
            weeks.append(models.Week(id=i, title=f"Week {i}", status=status))
        db.add_all(weeks)
        db.commit()

@app.get("/api/roadmap")
def get_roadmap(db: Session = Depends(get_db)):
    weeks = db.query(models.Week).order_by(models.Week.id).all()
    # Serialize relationships if needed, here just returning the basic dicts
    return weeks

@app.post("/api/weeks/{week_id}/complete")
def complete_week(week_id: int, request: WeekCompleteRequest, db: Session = Depends(get_db)):
    if not request.deliverable_link:
        raise HTTPException(status_code=400, detail="deliverable_link is required")
        
    week = db.query(models.Week).filter(models.Week.id == week_id).first()
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
        
    # Check if previous week is completed (unless it's week 1)
    if week_id > 1:
        prev_week = db.query(models.Week).filter(models.Week.id == week_id - 1).first()
        if prev_week.status != models.WeekStatus.COMPLETED:
            raise HTTPException(status_code=400, detail=f"Cannot complete Week {week_id} because Week {week_id - 1} is not complete.")
            
    week.status = models.WeekStatus.COMPLETED
    week.deliverable_link = request.deliverable_link
    
    # Unlock next week
    if week_id < 12:
        next_week = db.query(models.Week).filter(models.Week.id == week_id + 1).first()
        if next_week and next_week.status == models.WeekStatus.LOCKED:
            next_week.status = models.WeekStatus.IN_PROGRESS
            
    db.commit()
    return {"message": f"Week {week_id} marked as complete"}

@app.post("/api/weeks/{week_id}/benchmarks")
def add_benchmarks(week_id: int, benchmark: BenchmarkCreate, db: Session = Depends(get_db)):
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
