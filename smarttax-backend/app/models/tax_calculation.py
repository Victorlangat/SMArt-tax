from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class TaxCalculation(Base):
    __tablename__ = "tax_calculations"
    
    id = Column(Integer, primary_key=True, index=True)
    calculation_id = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    
    # Vehicle details (snapshot at time of calculation)
    make = Column(String(100))
    model = Column(String(100))
    year = Column(Integer)
    engine_cc = Column(Integer)
    fuel_type = Column(String(50))
    
    # Values
    vehicle_value = Column(Float)
    cif_value = Column(Float)
    import_duty = Column(Float)
    excise_duty = Column(Float)
    vat = Column(Float)
    idf = Column(Float)
    rdl = Column(Float)
    total_tax = Column(Float, nullable=False)
    
    # Metadata
    accuracy_score = Column(Float)
    status = Column(String(50), default="draft")  # draft, saved, submitted
    match_percentage = Column(Float)
    notes = Column(Text)
    calculation_date = Column(DateTime(timezone=True), server_default=func.now())
    saved_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User")
    vehicle = relationship("Vehicle")