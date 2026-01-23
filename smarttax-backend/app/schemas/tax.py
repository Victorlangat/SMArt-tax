from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TaxCalculationBase(BaseModel):
    vehicle_id: Optional[int] = None
    vehicle_value: Optional[float] = None
    cif_value: Optional[float] = None
    notes: Optional[str] = None

class TaxCalculationCreate(TaxCalculationBase):
    pass

class TaxComponent(BaseModel):
    name: str
    rate: float
    amount: float
    description: str

class TaxCalculationResponse(BaseModel):
    id: int
    calculation_id: str
    user_id: int
    vehicle_id: Optional[int]
    
    # Vehicle details
    make: Optional[str]
    model: Optional[str]
    year: Optional[int]
    engine_cc: Optional[int]
    fuel_type: Optional[str]
    
    # Tax amounts
    vehicle_value: Optional[float]
    cif_value: Optional[float]
    import_duty: Optional[float]
    excise_duty: Optional[float]
    vat: Optional[float]
    idf: Optional[float]
    rdl: Optional[float]
    total_tax: float
    
    # Metadata
    accuracy_score: Optional[float]
    status: str
    match_percentage: Optional[float]
    notes: Optional[str]
    calculation_date: datetime
    saved_at: Optional[datetime]
    
    # Components for breakdown
    components: List[TaxComponent] = []
    
    class Config:
        from_attributes = True

class TaxResult(BaseModel):
    calculation: TaxCalculationResponse
    savings: Optional[float] = None
    recommendation: Optional[str] = None