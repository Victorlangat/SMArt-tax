from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    crsp_id = Column(String(50), unique=True, index=True, nullable=False)
    make = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    engine_cc = Column(Integer, nullable=False)
    fuel_type = Column(String(50))  # petrol, diesel, hybrid, electric
    transmission = Column(String(50))  # automatic, manual, cvt
    crsp_value = Column(Float, nullable=False)
    customs_value = Column(Float)
    trim = Column(String(100))
    depreciation_rate = Column(Float)
    last_updated = Column(Date, nullable=False)
    updated_by = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())