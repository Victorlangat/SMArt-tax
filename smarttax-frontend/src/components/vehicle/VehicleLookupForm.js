import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import '../../styles/pages/vehicle.css';

const VehicleLookupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    trim: '',
    engineCC: '',
    fuelType: '',
    transmission: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit && onSubmit(formData);
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      trim: '',
      engineCC: '',
      fuelType: '',
      transmission: ''
    });
  };

  const makes = ['Toyota', 'Suzuki', 'Mazda', 'Honda', 'Nissan', 'Mitsubishi', 'Subaru', 'Lexus'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const transmissions = ['Automatic', 'Manual', 'CVT'];

  return (
    <Card title="Vehicle Lookup" icon="🔍" padding>
      <form onSubmit={handleSubmit} className="vehicle-lookup-form">
        <div className="form-grid">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Make *</label>
              <select
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="smarttax-select"
                required
              >
                <option value="">Select Make</option>
                {makes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Model *</label>
              <Input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., Swift, Vitz, Demio"
                required
              />
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Year *</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="smarttax-select"
                required
              >
                <option value="">Select Year</option>
                {Array.from({length: 8}, (_, i) => {
                  const year = 2025 - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Trim (Optional)</label>
              <Input
                type="text"
                name="trim"
                value={formData.trim}
                onChange={handleChange}
                placeholder="e.g., GL, G, Hybrid F"
              />
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Engine CC *</label>
              <div className="input-with-unit">
                <Input
                  type="number"
                  name="engineCC"
                  value={formData.engineCC}
                  onChange={handleChange}
                  placeholder="e.g., 1200, 1500"
                  required
                />
                <span className="input-unit">cc</span>
              </div>
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Fuel Type *</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="smarttax-select"
                required
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Transmission *</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="smarttax-select"
                required
              >
                <option value="">Select Transmission</option>
                {transmissions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button 
            type="submit"
            variant="primary"
            loading={loading}
            icon="🔍"
          >
            Lookup Vehicle
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default VehicleLookupForm;