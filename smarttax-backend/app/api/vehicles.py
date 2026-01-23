from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.core.database import get_db
from app.models.vehicle import Vehicle
from app.models.user import User
from app.schemas.vehicle import (
    VehicleCreate, 
    VehicleResponse, 
    VehicleUpdate, 
    VehicleSearch
)
from app.api.auth import get_current_active_user

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("/", response_model=List[VehicleResponse])
def get_vehicles(
    search: VehicleSearch = Depends(),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all vehicles with optional filters"""
    query = db.query(Vehicle)
    
    # Apply filters
    if search.make:
        query = query.filter(Vehicle.make.ilike(f"%{search.make}%"))
    if search.model:
        query = query.filter(Vehicle.model.ilike(f"%{search.model}%"))
    if search.year:
        query = query.filter(Vehicle.year == search.year)
    if search.engine_cc_min:
        query = query.filter(Vehicle.engine_cc >= search.engine_cc_min)
    if search.engine_cc_max:
        query = query.filter(Vehicle.engine_cc <= search.engine_cc_max)
    if search.fuel_type:
        query = query.filter(Vehicle.fuel_type == search.fuel_type)
    
    # Order by make and model
    query = query.order_by(Vehicle.make, Vehicle.model, Vehicle.year.desc())
    
    vehicles = query.offset(skip).limit(limit).all()
    return vehicles

@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    """Get vehicle by ID"""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.post("/", response_model=VehicleResponse)
def create_vehicle(
    vehicle_data: VehicleCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new vehicle (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin users can create vehicles"
        )
    
    # Generate CRSP ID
    crsp_id = f"CRSP-{str(uuid.uuid4())[:8].upper()}"
    
    db_vehicle = Vehicle(
        crsp_id=crsp_id,
        make=vehicle_data.make,
        model=vehicle_data.model,
        year=vehicle_data.year,
        engine_cc=vehicle_data.engine_cc,
        fuel_type=vehicle_data.fuel_type.value,
        transmission=vehicle_data.transmission.value,
        crsp_value=vehicle_data.crsp_value,
        customs_value=vehicle_data.customs_value,
        depreciation_rate=vehicle_data.depreciation_rate,
        last_updated=vehicle_data.last_updated,
        updated_by=current_user.full_name
    )
    
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    
    return db_vehicle

@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    vehicle_data: VehicleUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update vehicle (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin users can update vehicles"
        )
    
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # Update fields
    update_data = vehicle_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(vehicle, field):
            setattr(vehicle, field, value)
    
    vehicle.updated_by = current_user.full_name
    db.commit()
    db.refresh(vehicle)
    
    return vehicle

@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete vehicle (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin users can delete vehicles"
        )
    
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(vehicle)
    db.commit()
    
    return {"message": "Vehicle deleted successfully"}

@router.get("/search/by-make-model")
def search_by_make_model(
    make: Optional[str] = None,
    model: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Search vehicles by make and/or model"""
    query = db.query(Vehicle)
    
    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))
    
    vehicles = query.order_by(Vehicle.make, Vehicle.model).limit(50).all()
    
    # Group by make for frontend dropdown
    makes = {}
    for vehicle in vehicles:
        if vehicle.make not in makes:
            makes[vehicle.make] = []
        
        # Add model if not already in list
        if vehicle.model not in makes[vehicle.make]:
            makes[vehicle.make].append(vehicle.model)
    
    return {
        "makes": makes,
        "vehicles": vehicles[:10]  # Return first 10 vehicles
    }

@router.get("/stats/count")
def get_vehicle_stats(db: Session = Depends(get_db)):
    """Get vehicle statistics"""
    total = db.query(Vehicle).count()
    
    # Count by make
    makes = db.query(Vehicle.make).distinct().count()
    
    # Count by year range
    recent = db.query(Vehicle).filter(Vehicle.year >= 2020).count()
    older = db.query(Vehicle).filter(Vehicle.year < 2020).count()
    
    return {
        "total_vehicles": total,
        "unique_makes": makes,
        "recent_vehicles": recent,
        "older_vehicles": older
    }