from pydantic import BaseModel, validator
from typing import Optional
from datetime import date, datetime
from enum import Enum

class FuelType(str, Enum):
    petrol = "petrol"
    diesel = "diesel"
    hybrid = "hybrid"
    electric = "electric"

class Transmission(str, Enum):
    automatic = "automatic"
    manual = "manual"
    cvt = "cvt"

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    engine_cc: int
    fuel_type: FuelType = FuelType.petrol
    transmission: Transmission = Transmission.automatic
    trim: Optional[str] = None

class VehicleCreate(VehicleBase):
    crsp_value: float
    customs_value: Optional[float] = None
    depreciation_rate: Optional[float] = None
    last_updated: date
    
    @validator('year')
    def validate_year(cls, v):
        if v < 2000 or v > 2025:
            raise ValueError('Year must be between 2000 and 2025')
        return v
    
    @validator('engine_cc')
    def validate_engine_cc(cls, v):
        if v < 500 or v > 8000:
            raise ValueError('Engine CC must be between 500 and 8000')
        return v

class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    engine_cc: Optional[int] = None
    fuel_type: Optional[FuelType] = None
    transmission: Optional[Transmission] = None
    trim: Optional[str] = None
    crsp_value: Optional[float] = None
    customs_value: Optional[float] = None
    depreciation_rate: Optional[float] = None
    last_updated: Optional[date] = None

class VehicleResponse(VehicleBase):
    id: int
    crsp_id: str
    crsp_value: float
    customs_value: Optional[float]
    depreciation_rate: Optional[float]
    last_updated: date
    updated_by: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class VehicleSearch(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    engine_cc_min: Optional[int] = None
    engine_cc_max: Optional[int] = None
    fuel_type: Optional[FuelType] = None