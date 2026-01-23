import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import VehicleLookupForm from '../components/vehicle/VehicleLookupForm';
import VehicleDetails from '../components/vehicle/VehicleDetails';
import DocumentUpload from '../components/document/DocumentUpload';
import DocumentVerification from '../components/document/DocumentVerification';
import TaxCalculatorForm from '../components/tax/TaxCalculatorForm';
import TaxBreakdown from '../components/tax/TaxBreakdown';
import TaxSummary from '../components/tax/TaxSummary';
import DiscrepancyAlert from '../components/document/DiscrepancyAlert';
import '../styles/pages/calculator.css';

const TaxCalculator = () => {
  const navigate = useNavigate();
  
  // Main steps state
  const [activeStep, setActiveStep] = useState(1);
  const [vehicleData, setVehicleData] = useState(null);
  const [documents, setDocuments] = useState({});
  const [calculationResult, setCalculationResult] = useState(null);
  
  // States for each step
  const [lookupLoading, setLookupLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [verificationResults, setVerificationResults] = useState({});
  const [discrepancies, setDiscrepancies] = useState([]);
  const [savedCalculations, setSavedCalculations] = useState([]);
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Sample vehicle data for quick selection
  const popularVehicles = [
    { make: 'Toyota', model: 'Vitz', year: 2022, engineCC: 1300, fuelType: 'petrol', transmission: 'automatic' },
    { make: 'Suzuki', model: 'Swift', year: 2021, engineCC: 1200, fuelType: 'petrol', transmission: 'manual' },
    { make: 'Mazda', model: 'Demio', year: 2020, engineCC: 1500, fuelType: 'petrol', transmission: 'automatic' },
    { make: 'Toyota', model: 'Premio', year: 2019, engineCC: 2000, fuelType: 'petrol', transmission: 'automatic' },
    { make: 'Honda', model: 'Fit', year: 2021, engineCC: 1300, fuelType: 'hybrid', transmission: 'CVT' }
  ];

  // Step configurations
  const steps = [
    { id: 1, title: 'Vehicle Details', icon: '🚗', description: 'Select or enter vehicle information' },
    { id: 2, title: 'Upload Documents', icon: '📄', description: 'Upload import documents for verification' },
    { id: 3, title: 'Verify Documents', icon: '🔍', description: 'Check documents against KRA standards' },
    { id: 4, title: 'Calculate Tax', icon: '🧮', description: 'Compute import duties and taxes' },
    { id: 5, title: 'Review & Save', icon: '📋', description: 'Review calculation and generate report' }
  ];

  // Handle vehicle lookup
  const handleVehicleLookup = (formData) => {
    setLookupLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add CRSP data and pricing
      const crspData = {
        id: `CRSP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        crspValue: formData.engineCC * 2500,
        customsValue: formData.engineCC * 2000,
        age: 2025 - formData.year,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setVehicleData({
        ...formData,
        ...crspData,
        matchPercentage: Math.floor(Math.random() * 20) + 80
      });
      setLookupLoading(false);
      
      // Auto-advance to next step
      setTimeout(() => setActiveStep(2), 500);
    }, 1500);
  };

  // Handle vehicle selection from popular vehicles
  const handleSelectPopularVehicle = (vehicle) => {
    setVehicleData({
      ...vehicle,
      id: `CRSP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      crspValue: vehicle.engineCC * 2500,
      customsValue: vehicle.engineCC * 2000,
      age: 2025 - vehicle.year,
      matchPercentage: Math.floor(Math.random() * 20) + 80,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setActiveStep(2);
  };

  // Handle document upload
  const handleDocumentUpload = (docType, file) => {
    setUploadLoading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newDocs = { ...documents };
      
      if (docType === 'all') {
        // Mark all as uploaded
        ['invoice', 'billOfLading', 'exportCertificate', 'inspectionCertificate'].forEach(key => {
          newDocs[key] = { name: `${key}.pdf`, uploaded: true, timestamp: new Date().toISOString() };
        });
      } else if (file) {
        newDocs[docType] = { 
          name: file.name, 
          uploaded: true, 
          timestamp: new Date().toISOString(),
          size: file.size
        };
      }
      
      setDocuments(newDocs);
      setUploadLoading(false);
      
      // Auto-advance if all required documents uploaded
      const requiredDocs = ['invoice', 'billOfLading', 'exportCertificate', 'inspectionCertificate'];
      const allUploaded = requiredDocs.every(doc => newDocs[doc]?.uploaded);
      
      if (allUploaded && docType !== 'all') {
        setTimeout(() => setActiveStep(3), 500);
      }
    }, 1000);
  };

  // Handle document verification
  const handleDocumentVerification = (isAllVerified) => {
    if (isAllVerified) {
      // Generate sample discrepancies
      const sampleDiscrepancies = [
        {
          id: 'DISC-001',
          description: 'Invoice amount mismatch',
          severity: 'warning',
          document: 'Commercial Invoice',
          field: 'Total Amount',
          expected: 'KES 3,200,000',
          found: 'KES 2,800,000'
        }
      ];
      
      setVerificationResults({
        verified: true,
        timestamp: new Date().toISOString(),
        discrepancies: sampleDiscrepancies
      });
      
      setDiscrepancies(sampleDiscrepancies);
      setActiveStep(4);
    }
  };

  // Handle tax calculation
  const handleTaxCalculate = (formData) => {
    const calculateLoading = true; // Local variable instead of state
    
    // Simulate calculation
    setTimeout(() => {
      const customsValue = parseFloat(formData.vehicleValue) || 3000000;
      const cifValue = parseFloat(formData.cifValue) || 3500000;
      
      // Tax calculations
      const importDuty = customsValue * 0.35;
      const exciseBase = customsValue + importDuty;
      const exciseRate = formData.engineCC > 2500 ? 0.35 : 0.20;
      const exciseDuty = exciseBase * exciseRate;
      const vatBase = customsValue + importDuty + exciseDuty;
      const vat = vatBase * 0.16;
      const idf = customsValue * 0.025;
      const rdl = customsValue * 0.02;
      const totalTax = importDuty + exciseDuty + vat + idf + rdl;
      
      const result = {
        importDuty,
        exciseDuty,
        vat,
        idf,
        rdl,
        totalTax,
        customsValue,
        cifValue,
        vehicleDetails: vehicleData,
        calculationDate: new Date().toLocaleDateString('en-KE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        calculations: [
          { description: 'Customs Value', value: customsValue },
          { description: 'Import Duty @ 35%', value: importDuty },
          { description: 'Excise Duty Base', value: exciseBase },
          { description: `Excise Duty @ ${exciseRate * 100}%`, value: exciseDuty },
          { description: 'VAT Base', value: vatBase },
          { description: 'VAT @ 16%', value: vat },
          { description: 'IDF @ 2.5%', value: idf },
          { description: 'RDL @ 2%', value: rdl }
        ],
        savingAmount: Math.round(Math.random() * 150000),
        accuracyScore: 98,
        referenceId: `CALC-${Date.now().toString().slice(-6)}`
      };
      
      setCalculationResult(result);
      setActiveStep(5);
    }, 2000);
  };

  // Handle save calculation
  const handleSaveCalculation = () => {
    if (calculationResult) {
      const savedCalc = {
        ...calculationResult,
        id: Date.now(),
        savedAt: new Date().toISOString()
      };
      
      setSavedCalculations(prev => [savedCalc, ...prev.slice(0, 4)]);
      setShowSaveModal(false);
      setShowSuccessModal(true);
      
      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem('smarttax_calculations') || '[]');
      localStorage.setItem('smarttax_calculations', JSON.stringify([savedCalc, ...existing]));
    }
  };

  // Handle export
  const handleExport = (format) => {
    console.log(`Exporting as ${format}...`);
    setShowExportModal(false);
    
    // Show success message
    setTimeout(() => {
      alert(`${format.toUpperCase()} report generated successfully!`);
    }, 1000);
  };

  // Handle start over
  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? All unsaved data will be lost.')) {
      setVehicleData(null);
      setDocuments({});
      setCalculationResult(null);
      setVerificationResults({});
      setDiscrepancies([]);
      setActiveStep(1);
    }
  };

  // Navigation handlers
  const handleNextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Check if step can proceed
  const canProceed = () => {
    switch (activeStep) {
      case 1: return vehicleData !== null;
      case 2: return Object.keys(documents).filter(k => documents[k]?.uploaded).length >= 4;
      case 3: return verificationResults.verified;
      case 4: return calculationResult !== null;
      default: return true;
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="step-content vehicle-step">
            <div className="step-header">
              <h3>Select Vehicle</h3>
              <p>Choose a vehicle to calculate import taxes. You can either select from popular models or enter details manually.</p>
            </div>
            
            {/* Popular Vehicles */}
            <div className="popular-vehicles-section">
              <Card title="Popular Vehicle Models" icon="⭐" padding>
                <div className="popular-vehicles-grid">
                  {popularVehicles.map((vehicle, index) => (
                    <div 
                      key={index} 
                      className={`vehicle-card ${vehicleData?.make === vehicle.make && vehicleData?.model === vehicle.model ? 'selected' : ''}`}
                      onClick={() => handleSelectPopularVehicle(vehicle)}
                    >
                      <div className="vehicle-icon">🚗</div>
                      <div className="vehicle-info">
                        <h4>{vehicle.make} {vehicle.model}</h4>
                        <p>{vehicle.year} • {vehicle.engineCC}cc • {vehicle.transmission}</p>
                        <span className="vehicle-tag">{vehicle.fuelType}</span>
                      </div>
                      <div className="select-indicator">
                        {vehicleData?.make === vehicle.make && vehicleData?.model === vehicle.model ? '✓' : '→'}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            {/* Or Divider */}
            <div className="or-divider">
              <span>OR</span>
            </div>
            
            {/* Manual Entry */}
            <div className="manual-entry-section">
              <Card title="Manual Vehicle Entry" icon="✏️" padding>
                <VehicleLookupForm 
                  onSubmit={handleVehicleLookup}
                  loading={lookupLoading}
                />
                
                {vehicleData && (
                  <div className="vehicle-selected-preview">
                    <div className="selected-vehicle-header">
                      <div className="selected-icon">✅</div>
                      <div>
                        <h4>Vehicle Selected</h4>
                        <p>{vehicleData.make} {vehicleData.model} ({vehicleData.year})</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => setVehicleData(null)}
                    >
                      Change Vehicle
                    </Button>
                  </div>
                )}
              </Card>
            </div>
            
            {/* Selected Vehicle Preview */}
            {vehicleData && (
              <div className="selected-vehicle-details">
                <VehicleDetails vehicle={vehicleData} />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="step-content upload-step">
            <div className="step-header">
              <h3>Upload Documents</h3>
              <p>Upload all required import documents for verification. All documents are securely processed and checked against KRA standards.</p>
            </div>
            
            {/* Document Upload */}
            <DocumentUpload 
              onUploadComplete={handleDocumentUpload}
            />
            
            {/* Upload Progress */}
            {Object.keys(documents).length > 0 && (
              <div className="upload-progress-summary">
                <Card padding>
                  <div className="progress-summary">
                    <div className="progress-stats">
                      <div className="stat-item">
                        <div className="stat-label">Uploaded</div>
                        <div className="stat-value">
                          {Object.keys(documents).filter(k => documents[k]?.uploaded).length}/5
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label">Remaining</div>
                        <div className="stat-value">
                          {5 - Object.keys(documents).filter(k => documents[k]?.uploaded).length}
                        </div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-label">Status</div>
                        <div className={`stat-status ${Object.keys(documents).filter(k => documents[k]?.uploaded).length >= 4 ? 'complete' : 'incomplete'}`}>
                          {Object.keys(documents).filter(k => documents[k]?.uploaded).length >= 4 ? 'Ready for Verification' : 'Upload Required'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${(Object.keys(documents).filter(k => documents[k]?.uploaded).length / 5) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Quick Upload Options */}
            <div className="quick-upload-options">
              <Card title="Quick Actions" icon="⚡" padding>
                <div className="quick-actions">
                  <button 
                    className="quick-action-btn"
                    onClick={() => handleDocumentUpload('all', null)}
                    disabled={uploadLoading}
                  >
                    <span className="action-icon">📤</span>
                    <span className="action-text">Upload Sample Documents</span>
                  </button>
                  
                  <button 
                    className="quick-action-btn"
                    onClick={() => {
                      const requiredDocs = ['invoice', 'billOfLading', 'exportCertificate', 'inspectionCertificate'];
                      const newDocs = {};
                      requiredDocs.forEach(doc => {
                        newDocs[doc] = { name: `${doc}.pdf`, uploaded: true };
                      });
                      setDocuments(newDocs);
                    }}
                  >
                    <span className="action-icon">✅</span>
                    <span className="action-text">Mark All as Uploaded</span>
                  </button>
                  
                  <button 
                    className="quick-action-btn"
                    onClick={() => setDocuments({})}
                  >
                    <span className="action-icon">🗑️</span>
                    <span className="action-text">Clear All Documents</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content verify-step">
            <div className="step-header">
              <h3>Verify Documents</h3>
              <p>Check uploaded documents against KRA compliance standards and CRSP database for accuracy.</p>
            </div>
            
            {/* Document Verification */}
            <DocumentVerification 
              documents={documents}
              onVerifyComplete={handleDocumentVerification}
            />
            
            {/* Discrepancies */}
            {discrepancies.length > 0 && (
              <div className="discrepancies-section">
                <DiscrepancyAlert 
                  discrepancies={discrepancies}
                  onResolve={(discrepancy) => {
                    if (discrepancy === 'all') {
                      setDiscrepancies([]);
                    } else {
                      setDiscrepancies(prev => prev.filter(d => d.id !== discrepancy.id));
                    }
                  }}
                  onOverride={(discrepancy) => {
                    if (discrepancy === 'all') {
                      setDiscrepancies([]);
                    } else {
                      setDiscrepancies(prev => prev.filter(d => d.id !== discrepancy.id));
                    }
                  }}
                />
              </div>
            )}
            
            {/* Verification Status */}
            <div className="verification-status-card">
              <Card padding>
                <div className="status-content">
                  <div className="status-header">
                    <div className="status-icon">
                      {verificationResults.verified ? '✅' : '🔍'}
                    </div>
                    <div className="status-info">
                      <h4>Verification Status</h4>
                      <p>
                        {verificationResults.verified 
                          ? 'All documents verified successfully' 
                          : 'Awaiting verification'}
                      </p>
                    </div>
                  </div>
                  
                  {verificationResults.verified && (
                    <div className="status-details">
                      <div className="detail-item">
                        <span className="detail-label">Verified At:</span>
                        <span className="detail-value">
                          {new Date(verificationResults.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Discrepancies Found:</span>
                        <span className="detail-value">{discrepancies.length}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Ready for Calculation:</span>
                        <span className="detail-value status-ready">Yes</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content calculate-step">
            <div className="step-header">
              <h3>Calculate Tax</h3>
              <p>Enter vehicle valuation details to compute comprehensive import duties and taxes based on KRA 2025 CRSP guidelines.</p>
            </div>
            
            {/* Vehicle Summary */}
            {vehicleData && (
              <div className="vehicle-summary-card">
                <Card title="Selected Vehicle" icon="🚗" padding>
                  <div className="vehicle-summary">
                    <div className="summary-row">
                      <span className="summary-label">Make/Model:</span>
                      <span className="summary-value">{vehicleData.make} {vehicleData.model}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Year:</span>
                      <span className="summary-value">{vehicleData.year}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Engine:</span>
                      <span className="summary-value">{vehicleData.engineCC}cc {vehicleData.fuelType}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">CRSP Match:</span>
                      <span className="summary-value highlight">{vehicleData.matchPercentage}%</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Tax Calculator Form */}
            <div className="calculator-form-section">
              <TaxCalculatorForm 
                vehicle={vehicleData}
                onSubmit={handleTaxCalculate}
              />
            </div>
            
            {/* Quick Calculation Tips */}
            <div className="calculation-tips">
              <Card title="Calculation Tips" icon="💡" padding>
                <ul className="tips-list">
                  <li>Customs Value is based on CRSP database and vehicle depreciation</li>
                  <li>Shipping and insurance costs are added to get CIF Value</li>
                  <li>Taxes are calculated in sequence: Import Duty → Excise Duty → VAT → IDF → RDL</li>
                  <li>Excise duty rates vary by engine capacity (20% below 2500cc, 35% above)</li>
                  <li>Save your calculation for future reference and reporting</li>
                </ul>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content review-step">
            <div className="step-header">
              <h3>Review & Save</h3>
              <p>Review your tax calculation results and save or export the report for KRA submission.</p>
            </div>
            
            {/* Success Banner */}
            {calculationResult && (
              <div className="success-banner">
                <div className="banner-content">
                  <div className="banner-icon">🎉</div>
                  <div className="banner-text">
                    <h4>Calculation Complete!</h4>
                    <p>Reference ID: {calculationResult.referenceId}</p>
                  </div>
                  <div className="banner-actions">
                    <Button 
                      variant="outline"
                      size="small"
                      onClick={() => setShowSaveModal(true)}
                    >
                      Save Calculation
                    </Button>
                    <Button 
                      variant="primary"
                      size="small"
                      onClick={() => setShowExportModal(true)}
                    >
                      Export Report
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Results Grid */}
            {calculationResult && (
              <div className="results-grid">
                <div className="grid-column">
                  <TaxSummary 
                    taxData={calculationResult}
                    onGenerateReport={() => setShowExportModal(true)}
                    onSaveCalculation={() => setShowSaveModal(true)}
                  />
                  
                  {/* Saved Calculations Preview */}
                  {savedCalculations.length > 0 && (
                    <Card title="Recent Calculations" icon="📊" padding>
                      <div className="saved-calculations-list">
                        {savedCalculations.slice(0, 3).map((calc, index) => (
                          <div key={index} className="saved-calculation">
                            <div className="calc-info">
                              <span className="calc-vehicle">{calc.vehicleDetails?.make} {calc.vehicleDetails?.model}</span>
                              <span className="calc-tax">KES {calc.totalTax.toLocaleString()}</span>
                            </div>
                            <div className="calc-meta">
                              <span className="calc-date">{calc.calculationDate}</span>
                              <span className="calc-ref">{calc.referenceId}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="view-all-link">
                        <button onClick={() => navigate('/reports')}>
                          View All Calculations →
                        </button>
                      </div>
                    </Card>
                  )}
                </div>
                
                <div className="grid-column">
                  <TaxBreakdown taxData={calculationResult} />
                  
                  {/* Important Notes */}
                  <Card title="Important Notes" icon="⚠️" padding>
                    <div className="important-notes">
                      <ul className="notes-list">
                        <li>This is an estimate for planning purposes only</li>
                        <li>Final tax amount determined by KRA upon vehicle inspection</li>
                        <li>Always verify with official KRA documentation</li>
                        <li>Keep all original documents for verification</li>
                        <li>Tax rates based on 2025 KRA CRSP guidelines</li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="review-actions">
              <div className="action-buttons">
                <Button 
                  variant="secondary"
                  onClick={() => setActiveStep(4)}
                >
                  ← Recalculate
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleStartOver}
                >
                  Start New Calculation
                </Button>
                <Button 
                  variant="success"
                  icon="📋"
                  onClick={() => setShowExportModal(true)}
                >
                  Generate Final Report
                </Button>
              </div>
              
              <div className="action-help">
                <p>
                  Need help? <a href="/help">Contact support</a> or 
                  view <a href="/tutorials">calculation tutorials</a>
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="tax-calculator-page">
      <Header 
        title="Tax Calculator"
        subtitle="Step-by-step calculation of vehicle import duties"
        breadcrumbs={['Dashboard', 'Tax Calculator']}
        actions={
          <Button 
            variant="outline"
            onClick={handleStartOver}
          >
            Start Over
          </Button>
        }
      />
      
      <Sidebar />
      
      <main className="main-content">
        <div className="content-container">
          {/* Progress Steps */}
          <div className="calculator-progress">
            <div className="progress-steps">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className={`progress-step ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}
                  onClick={() => {
                    if (activeStep > step.id) {
                      setActiveStep(step.id);
                    }
                  }}
                >
                  <div className="step-circle">
                    <span className="step-icon">{step.icon}</span>
                    {activeStep > step.id && <div className="check-mark">✓</div>}
                  </div>
                  <div className="step-info">
                    <div className="step-title">{step.title}</div>
                    <div className="step-description">{step.description}</div>
                  </div>
                  {step.id < steps.length && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="calculator-content">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="calculator-navigation">
            <div className="nav-buttons">
              {activeStep > 1 && (
                <Button 
                  variant="secondary"
                  onClick={handlePrevStep}
                  disabled={activeStep === 1}
                >
                  ← Previous Step
                </Button>
              )}
              
              <div className="step-indicator">
                Step {activeStep} of {steps.length}
              </div>
              
              {activeStep < steps.length ? (
                <Button 
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={!canProceed()}
                  icon="→"
                >
                  Continue to {steps[activeStep].title}
                </Button>
              ) : (
                <div className="completion-actions">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/reports')}
                  >
                    View All Reports
                  </Button>
                  <Button 
                    variant="success"
                    onClick={() => setShowExportModal(true)}
                    icon="📥"
                  >
                    Download Final Report
                  </Button>
                </div>
              )}
            </div>
            
            <div className="nav-help">
              <p>Need assistance? <a href="/help">Get help with this step</a></p>
            </div>
          </div>
        </div>
        
        <Footer />
      </main>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Calculation Saved!"
        size="small"
      >
        <div className="success-modal">
          <div className="modal-icon">🎉</div>
          <h3>Calculation Saved Successfully</h3>
          <p>Your tax calculation has been saved and can be accessed from the Reports page.</p>
          <div className="modal-actions">
            <Button 
              variant="secondary"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
            <Button 
              variant="primary"
              onClick={() => navigate('/reports')}
            >
              View Reports
            </Button>
          </div>
        </div>
      </Modal>

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Calculation"
        size="medium"
      >
        <div className="save-modal">
          <div className="modal-content">
            <Input
              label="Calculation Name"
              type="text"
              defaultValue={`${vehicleData?.make} ${vehicleData?.model} Tax Calculation`}
              placeholder="Enter a name for this calculation"
            />
            
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="description-textarea"
                placeholder="Add notes about this calculation..."
                rows={3}
                defaultValue={`Tax calculation for ${vehicleData?.make} ${vehicleData?.model} ${vehicleData?.year}`}
              />
            </div>
            
            <div className="save-options">
              <h4>Save Options:</h4>
              <div className="options-list">
                <label className="option-item">
                  <input type="checkbox" defaultChecked />
                  <span>Save to my calculations history</span>
                </label>
                <label className="option-item">
                  <input type="checkbox" defaultChecked />
                  <span>Generate PDF backup</span>
                </label>
                <label className="option-item">
                  <input type="checkbox" />
                  <span>Share with my accountant</span>
                </label>
                <label className="option-item">
                  <input type="checkbox" defaultChecked />
                  <span>Email me a copy</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <Button 
              variant="secondary"
              onClick={() => setShowSaveModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="success"
              onClick={handleSaveCalculation}
            >
              Save Calculation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Report"
        size="medium"
      >
        <div className="export-modal">
          <div className="modal-content">
            <div className="export-options">
              <div className="export-option">
                <div className="option-icon">📄</div>
                <div className="option-info">
                  <h4>PDF Report</h4>
                  <p>Print-ready document with all details for KRA submission</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleExport('pdf')}
                >
                  Export PDF
                </Button>
              </div>
              
              <div className="export-option">
                <div className="option-icon">📊</div>
                <div className="option-info">
                  <h4>Excel Spreadsheet</h4>
                  <p>Raw data for analysis and record keeping</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleExport('excel')}
                >
                  Export Excel
                </Button>
              </div>
              
              <div className="export-option">
                <div className="option-icon">📋</div>
                <div className="option-info">
                  <h4>CSV Data</h4>
                  <p>Comma-separated values for database import</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleExport('csv')}
                >
                  Export CSV
                </Button>
              </div>
              
              <div className="export-option">
                <div className="option-icon">🖨️</div>
                <div className="option-info">
                  <h4>Print</h4>
                  <p>Direct printing without saving</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleExport('print')}
                >
                  Print Now
                </Button>
              </div>
            </div>
            
            <div className="export-notes">
              <h4>Export Notes:</h4>
              <ul>
                <li>All exports include the SmartTax watermark</li>
                <li>PDF exports are optimized for KRA submission</li>
                <li>Excel files contain detailed calculation formulas</li>
                <li>Files are automatically named with your reference ID</li>
              </ul>
            </div>
          </div>
          
          <div className="modal-actions">
            <Button 
              variant="secondary"
              onClick={() => setShowExportModal(false)}
            >
              Close
            </Button>
            <Button 
              variant="primary"
              onClick={() => {
                handleExport('pdf');
                setShowExportModal(false);
              }}
            >
              Export All Formats
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaxCalculator;