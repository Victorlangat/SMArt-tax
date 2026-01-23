import React, { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import VehicleLookupForm from '../components/vehicle/VehicleLookupForm';
import VehicleDetails from '../components/vehicle/VehicleDetails';
import CRSPMatchResult from '../components/vehicle/CRSPMatchResult';
import Button from '../components/common/Button';
import '../styles/pages/vehicle.css';

const VehicleLookup = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [crspData, setCrspData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVehicleLookup = (vehicleData) => {
    setLoading(true);
    
    // Simulate API call to find vehicle
    setTimeout(() => {
      const mockCRSPData = {
        id: 'CRSP-2025-12345',
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        trim: vehicleData.trim || 'Base',
        engineCC: vehicleData.engineCC,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        age: 2025 - vehicleData.year,
        crspValue: getMockCRSPValue(vehicleData),
        customsValue: 0,
        lastUpdated: '2025-07-15'
      };
      
      // Calculate customs value with depreciation
      const depreciationRate = mockCRSPData.age <= 1 ? 0.1 :
                               mockCRSPData.age <= 3 ? 0.3 :
                               mockCRSPData.age <= 6 ? 0.5 : 0.65;
      
      mockCRSPData.customsValue = Math.round(mockCRSPData.crspValue * (1 - depreciationRate));
      
      setSelectedVehicle(vehicleData);
      setCrspData(mockCRSPData);
      setLoading(false);
    }, 1500);
  };

  const getMockCRSPValue = (vehicle) => {
    // Mock CRSP values based on vehicle type
    const baseValues = {
      'Suzuki': { 'Swift': 3200000, 'Vitara': 4500000 },
      'Toyota': { 'Vitz': 3400000, 'Premio': 4300000, 'Harrier': 4800000 },
      'Mazda': { 'Demio': 3300000, 'CX-5': 6800000 },
      'Honda': { 'Fit': 3500000, 'CR-V': 5200000 },
      'Nissan': { 'March': 3100000, 'X-Trail': 5000000 },
      'Lexus': { 'LX570': 14500000 }
    };
    
    const base = baseValues[vehicle.make]?.[vehicle.model] || 3500000;
    
    // Adjust for engine size
    const engineFactor = vehicle.engineCC / 1500;
    
    // Adjust for fuel type
    const fuelFactor = vehicle.fuelType === 'Hybrid' ? 1.2 : 
                       vehicle.fuelType === 'Diesel' ? 1.1 : 1.0;
    
    return Math.round(base * engineFactor * fuelFactor);
  };

  const handleCalculateTaxes = () => {
    if (selectedVehicle && crspData) {
      // Navigate to tax calculator with vehicle data
      const vehicleData = {
        ...selectedVehicle,
        customsValue: crspData.customsValue
      };
      
      // Store in session for tax calculator
      sessionStorage.setItem('vehicleForTax', JSON.stringify(vehicleData));
      window.location.href = '/tax-calculator';
    }
  };

  const handleClearResults = () => {
    setSelectedVehicle(null);
    setCrspData(null);
  };

  return (
    <div className="vehicle-lookup-page">
      <Header 
        title="Vehicle Lookup"
        subtitle="Find CRSP data for any vehicle model and verify import details"
        actions={
          <div className="header-actions-group">
            {selectedVehicle && (
              <Button 
                variant="secondary"
                onClick={handleClearResults}
                disabled={loading}
              >
                Clear Results
              </Button>
            )}
            {crspData && (
              <Button 
                variant="success"
                icon="🧮"
                onClick={handleCalculateTaxes}
              >
                Calculate Taxes
              </Button>
            )}
          </div>
        }
        breadcrumbs={['Dashboard', 'Vehicle Lookup']}
      />
      
      <Sidebar />
      
      <main className="main-content">
        <div className="content-container">
          {/* Vehicle Lookup Form */}
          <div className="section-card">
            <VehicleLookupForm 
              onSubmit={handleVehicleLookup}
              disabled={loading}
            />
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-content">
                <div className="loading-spinner"></div>
                <p>Searching CRSP database...</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {selectedVehicle && (
            <div className="results-section">
              <div className="section-header">
                <h2>
                  <span className="header-icon">🔍</span>
                  Lookup Results
                </h2>
                <p className="section-description">
                  Vehicle found in CRSP database. Review details below.
                </p>
              </div>
              
              <div className="results-grid">
                <div className="result-column">
                  <VehicleDetails vehicle={selectedVehicle} />
                </div>
                
                <div className="result-column">
                  {crspData && (
                    <CRSPMatchResult 
                      crspData={crspData}
                      matchPercentage={calculateMatchPercentage(selectedVehicle, crspData)}
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-section">
                <div className="action-buttons">
                  <Button 
                    variant="primary"
                    icon="🧮"
                    onClick={handleCalculateTaxes}
                    size="large"
                  >
                    Proceed to Tax Calculator
                  </Button>
                  <Button 
                    variant="outline"
                    icon="📄"
                    size="large"
                  >
                    Download CRSP Certificate
                  </Button>
                  <Button 
                    variant="secondary"
                    icon="🔄"
                    onClick={handleClearResults}
                    size="large"
                  >
                    Lookup Another Vehicle
                  </Button>
                </div>
                
                <div className="action-notes">
                  <p>
                    <strong>Note:</strong> CRSP data is based on KRA's July 2025 update. 
                    Actual taxes may vary based on final verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          {!selectedVehicle && !loading && (
            <div className="help-section">
              <div className="help-card">
                <div className="help-header">
                  <h3>
                    <span className="help-icon">❓</span>
                    Need Help Finding Your Vehicle?
                  </h3>
                </div>
                <div className="help-content">
                  <div className="help-tips">
                    <div className="tip">
                      <div className="tip-icon">🔍</div>
                      <div className="tip-content">
                        <h4>Exact Model Name</h4>
                        <p>Use the exact model name as shown on your vehicle documents.</p>
                      </div>
                    </div>
                    <div className="tip">
                      <div className="tip-icon">⚙️</div>
                      <div className="tip-content">
                        <h4>Engine Specifications</h4>
                        <p>Check your vehicle's engine CC and fuel type accurately.</p>
                      </div>
                    </div>
                    <div className="tip">
                      <div className="tip-icon">📅</div>
                      <div className="tip-content">
                        <h4>Manufacturing Year</h4>
                        <p>Use the year of manufacture, not year of registration.</p>
                      </div>
                    </div>
                    <div className="tip">
                      <div className="tip-icon">📋</div>
                      <div className="tip-content">
                        <h4>Trim Level</h4>
                        <p>Include trim level if known (e.g., GL, G, Hybrid F).</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="help-contact">
                    <p>
                      <strong>Can't find your vehicle?</strong>{' '}
                      Contact support or use manual valuation option.
                    </p>
                    <Button variant="outline" icon="📞">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

// Helper function to calculate match percentage
const calculateMatchPercentage = (vehicle, crspData) => {
  let score = 100;
  
  // Deduct points for mismatches
  if (vehicle.make !== crspData.make) score -= 30;
  if (vehicle.model !== crspData.model) score -= 40;
  if (vehicle.year !== crspData.year) score -= 15;
  if (vehicle.engineCC != crspData.engineCC) score -= 10;
  if (vehicle.fuelType !== crspData.fuelType) score -= 5;
  
  return Math.max(60, score); // Minimum 60% for demo
};

export default VehicleLookup;