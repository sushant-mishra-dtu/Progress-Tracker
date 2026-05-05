from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from database import Base

class WeekStatus(str, enum.Enum):
    LOCKED = "LOCKED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class Week(Base):
    __tablename__ = "weeks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    status = Column(Enum(WeekStatus), default=WeekStatus.LOCKED)
    deliverable_link = Column(String, nullable=True)

    benchmarks = relationship("Benchmark", back_populates="week", cascade="all, delete")

class Benchmark(Base):
    __tablename__ = "benchmarks"

    id = Column(Integer, primary_key=True, index=True)
    week_id = Column(Integer, ForeignKey("weeks.id"))
    power_mw = Column(Float)
    area_luts = Column(Integer)
    area_dsps = Column(Integer)
    timing_slack_ns = Column(Float)

    week = relationship("Week", back_populates="benchmarks")
