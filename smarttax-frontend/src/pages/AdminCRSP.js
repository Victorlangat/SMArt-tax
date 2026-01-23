import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import '../styles/pages/admin.css';

const AdminCRSP = () => {
  const [crspData, setCrspData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState({
    id: '',
    make: '',
    model: '',
    year: '',
    engineCC: '',
    fuelType: 'petrol',
    transmission: 'automatic',
    crspValue: '',
    trim: ''
  });

  // Sample CRSP data
  useEffect(() => {
    const sampleData = [
      {
        id: 'CRSP-001',
        make: 'Suzuki',
        model: 'Swift',
        year: 2025,
        engineCC: 1200,
        fuelType: 'petrol',
        transmission: 'automatic',
        crspValue: 3200000,
        trim: 'GL',
        lastUpdated: '2025-07-15',
        updatedBy: 'Admin'
      },
      {
        id: 'CRSP-002',
        make: 'Toyota',
        model: 'Vitz',
        year: 2025,
        engineCC: 1300,
        fuelType: 'hybrid',
        transmission: 'CVT',
        crspValue: 3400000,
        trim: 'Hybrid F',
        lastUpdated: '2025-07-15',
        updatedBy: 'Admin'
      },
      {
        id: 'CRSP-003',
        make: 'Mazda',
        model: 'Demio',
        year: 2025,
        engineCC: 1500,
        fuelType: 'petrol',
        transmission: 'automatic',
        crspValue: 3300000,
        trim: 'GL',
        lastUpdated: '2025-07-15',
        updatedBy: 'Admin'
      },
      {
        id: 'CRSP-004',
        make: 'Toyota',
        model: 'Premio',
        year: 2025,
        engineCC: 2000,
        fuelType: 'petrol',
        transmission: 'automatic',
        crspValue: 4300000,
        trim: '2.0G',
        lastUpdated: '2025-07-15',
        updatedBy: 'Admin'
      },
      {
        id: 'CRSP-005',
        make: 'Lexus',
        model: 'LX570',
        year: 2025,
        engineCC: 5700,
        fuelType: 'petrol',
        transmission: 'automatic',
        crspValue: 14500000,
        trim: 'Premium',
        lastUpdated: '2025-07-15',
        updatedBy: 'Admin'
      }
    ];
    
    setLoading(true);
    setTimeout(() => {
      setCrspData(sampleData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredData = crspData.filter(vehicle =>
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        setUploadFile(file);
      } else {
        alert('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleUpload = () => {
    if (!uploadFile) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    
    // Simulate upload process
    setTimeout(() => {
      alert(`CRSP database updated successfully with file: ${uploadFile.name}`);
      setUploadFile(null);
      setShowUploadModal(false);
      setLoading(false);
    }, 2000);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setLoading(true);
    
    // Simulate save
    setTimeout(() => {
      setCrspData(prev => 
        prev.map(v => v.id === editingVehicle.id ? editingVehicle : v)
      );
      setShowEditModal(false);
      setLoading(false);
      alert('Vehicle updated successfully!');
    }, 1000);
  };

  const handleDelete = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    
    setTimeout(() => {
      setCrspData(prev => prev.filter(v => v.id !== selectedVehicle));
      setShowDeleteModal(false);
      setLoading(false);
      alert('Vehicle deleted successfully!');
    }, 1000);
  };

  const handleAddVehicle = () => {
    const newVehicle = {
      id: `CRSP-${(crspData.length + 1).toString().padStart(3, '0')}`,
      make: '',
      model: '',
      year: 2025,
      engineCC: '',
      fuelType: 'petrol',
      transmission: 'automatic',
      crspValue: '',
      trim: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'Admin'
    };
    
    setEditingVehicle(newVehicle);
    setShowEditModal(true);
  };

  const handleExportCRSP = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      alert('CRSP database exported successfully!');
      // In real app, this would trigger file download
    }, 1500);
  };

  const handleSyncKRA = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      alert('Synced with KRA official database!');
    }, 2000);
  };

  return (
    <div className="admin-crsp-page">
      <Header 
        title="CRSP Administration"
        subtitle="Manage Current Retail Selling Price database for vehicle imports"
        actions={
          <div className="header-actions">
            <Button 
              variant="secondary"
              icon="📤"
              onClick={handleExportCRSP}
              disabled={loading}
            >
              Export CRSP
            </Button>
            <Button 
              variant="primary"
              icon="🔄"
              onClick={handleSyncKRA}
              disabled={loading}
            >
              Sync with KRA
            </Button>
            <Button 
              variant="success"
              icon="📋"
              onClick={() => setShowUploadModal(true)}
              disabled={loading}
            >
              Upload CRSP
            </Button>
          </div>
        }
        breadcrumbs={['Dashboard', 'Admin', 'CRSP Management']}
        searchEnabled={true}
        onSearch={setSearchTerm}
      />
      
      <Sidebar />
      
      <main className="main-content">
        <div className="content-container">
          {/* CRSP Stats */}
          <div className="crsp-stats">
            <Card className="stat-card" padding>
              <div className="stat-content">
                <div className="stat-icon">🚗</div>
                <div className="stat-info">
                  <h3>Total Vehicles</h3>
                  <div className="stat-value">{crspData.length}</div>
                </div>
              </div>
            </Card>
            
            <Card className="stat-card" padding>
              <div className="stat-content">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>Last Updated</h3>
                  <div className="stat-value">
                    {crspData[0]?.lastUpdated || 'N/A'}
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="stat-card" padding>
              <div className="stat-content">
                <div className="stat-icon">⚙️</div>
                <div className="stat-info">
                  <h3>Database Size</h3>
                  <div className="stat-value">5.2 MB</div>
                </div>
              </div>
            </Card>
            
            <Card className="stat-card" padding>
              <div className="stat-content">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>KRA Version</h3>
                  <div className="stat-value">July 2025</div>
                </div>
              </div>
            </Card>
          </div>

          {/* CRSP Table */}
          <div className="crsp-table-section">
            <Card 
              title="CRSP Database"
              icon="📋"
              padding
              footer={
                <div className="table-footer">
                  <div className="footer-info">
                    Showing {filteredData.length} of {crspData.length} vehicles
                  </div>
                  <Button 
                    variant="success"
                    icon="➕"
                    onClick={handleAddVehicle}
                    disabled={loading}
                  >
                    Add New Vehicle
                  </Button>
                </div>
              }
            >
              {loading ? (
                <div className="loading-data">
                  <div className="loading-spinner"></div>
                  <p>Loading CRSP data...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">🚗</div>
                  <h3>No Vehicles Found</h3>
                  <p>Try a different search term or add new vehicles.</p>
                </div>
              ) : (
                <div className="crsp-table">
                  <div className="table-header">
                    <div className="table-cell">ID</div>
                    <div className="table-cell">Make & Model</div>
                    <div className="table-cell">Year</div>
                    <div className="table-cell">Engine</div>
                    <div className="table-cell">Fuel Type</div>
                    <div className="table-cell">CRSP Value</div>
                    <div className="table-cell">Last Updated</div>
                    <div className="table-cell">Actions</div>
                  </div>
                  
                  {filteredData.map((vehicle) => (
                    <div key={vehicle.id} className="table-row">
                      <div className="table-cell cell-id">
                        <span className="cell-value">{vehicle.id}</span>
                      </div>
                      
                      <div className="table-cell cell-vehicle">
                        <div className="vehicle-cell">
                          <span className="vehicle-icon">🚗</span>
                          <div className="vehicle-info">
                            <span className="vehicle-make">{vehicle.make}</span>
                            <span className="vehicle-model">{vehicle.model} {vehicle.trim}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-cell cell-year">
                        <span className="cell-value">{vehicle.year}</span>
                      </div>
                      
                      <div className="table-cell cell-engine">
                        <span className="cell-value">{vehicle.engineCC} cc</span>
                      </div>
                      
                      <div className="table-cell cell-fuel">
                        <span className="fuel-badge">{vehicle.fuelType}</span>
                      </div>
                      
                      <div className="table-cell cell-crsp">
                        <span className="cell-value">
                          KES {vehicle.crspValue.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="table-cell cell-updated">
                        <span className="cell-value">{vehicle.lastUpdated}</span>
                        <span className="cell-subtext">by {vehicle.updatedBy}</span>
                      </div>
                      
                      <div className="table-cell cell-actions">
                        <div className="action-buttons">
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEdit(vehicle)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDelete(vehicle.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                          <button 
                            className="action-btn view"
                            onClick={() => setSelectedVehicle(vehicle)}
                            title="View Details"
                          >
                            👁️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* CRSP Information */}
          <div className="crsp-info">
            <Card title="CRSP Guidelines" icon="📘" padding>
              <div className="guidelines">
                <div className="guideline-item">
                  <div className="guideline-icon">📅</div>
                  <div className="guideline-content">
                    <h4>Update Schedule</h4>
                    <p>CRSP database is updated quarterly by KRA. Always use the latest version.</p>
                  </div>
                </div>
                
                <div className="guideline-item">
                  <div className="guideline-icon">⚖️</div>
                  <div className="guideline-content">
                    <h4>Legal Compliance</h4>
                    <p>All CRSP values must match KRA official database to ensure legal compliance.</p>
                  </div>
                </div>
                
                <div className="guideline-item">
                  <div className="guideline-icon">🔒</div>
                  <div className="guideline-content">
                    <h4>Data Security</h4>
                    <p>CRSP data is protected and should only be accessed by authorized personnel.</p>
                  </div>
                </div>
                
                <div className="guideline-item">
                  <div className="guideline-icon">🔄</div>
                  <div className="guideline-content">
                    <h4>Backup & Recovery</h4>
                    <p>Regular backups are maintained. Recovery point objective: 24 hours.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <Footer />
      </main>

      {/* Upload CRSP Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload CRSP Database"
        size="medium"
      >
        <div className="upload-crsp-modal">
          <div className="modal-content">
            <div className="upload-instructions">
              <h4>Upload Instructions:</h4>
              <ol>
                <li>Download the latest CRSP template from KRA website</li>
                <li>Fill in the vehicle information</li>
                <li>Save the file in Excel format (.xlsx)</li>
                <li>Upload the file below</li>
                <li>Verify data integrity before confirming</li>
              </ol>
            </div>
            
            <div className="upload-area">
              <label className="upload-label">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="file-input"
                />
                <div className="upload-box">
                  {uploadFile ? (
                    <div className="file-selected">
                      <span className="file-icon">📄</span>
                      <div className="file-info">
                        <span className="file-name">{uploadFile.name}</span>
                        <span className="file-size">
                          {(uploadFile.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="upload-icon">📤</span>
                      <span className="upload-text">Click to select Excel file</span>
                      <span className="upload-hint">.xlsx or .xls format only</span>
                    </>
                  )}
                </div>
              </label>
            </div>
            
            <div className="upload-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <p>
                  <strong>Warning:</strong> Uploading will replace the current CRSP database. 
                  Make sure you have a backup if needed.
                </p>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <Button 
              variant="secondary"
              onClick={() => setShowUploadModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="success"
              onClick={handleUpload}
              loading={loading}
              disabled={!uploadFile || loading}
            >
              Upload & Update Database
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Vehicle Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={editingVehicle.id.startsWith('CRSP-') ? 'Edit Vehicle' : 'Add New Vehicle'}
        size="medium"
      >
        <div className="edit-vehicle-modal">
          <div className="modal-content">
            <div className="form-grid">
              <div className="form-col">
                <Input
                  label="Make"
                  type="text"
                  value={editingVehicle.make}
                  onChange={(e) => setEditingVehicle(prev => ({ 
                    ...prev, 
                    make: e.target.value 
                  }))}
                  required
                />
              </div>
              
              <div className="form-col">
                <Input
                  label="Model"
                  type="text"
                  value={editingVehicle.model}
                  onChange={(e) => setEditingVehicle(prev => ({ 
                    ...prev, 
                    model: e.target.value 
                  }))}
                  required
                />
              </div>
              
              <div className="form-col">
                <Input
                  label="Year"
                  type="number"
                  value={editingVehicle.year}
                  onChange={(e) => setEditingVehicle(prev => ({ 
                    ...prev, 
                    year: parseInt(e.target.value) 
                  }))}
                  required
                />
              </div>
              
              <div className="form-col">
                <Input
                  label="Engine CC"
                  type="number"
                  value={editingVehicle.engineCC}
                  onChange={(e) => setEditingVehicle(prev => ({ 
                    ...prev, 
                    engineCC: parseInt(e.target.value) 
                  }))}
                  required
                />
              </div>
              
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Fuel Type</label>
                  <select
                    value={editingVehicle.fuelType}
                    onChange={(e) => setEditingVehicle(prev => ({ 
                      ...prev, 
                      fuelType: e.target.value 
                    }))}
                    className="smarttax-select"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>
              
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Transmission</label>
                  <select
                    value={editingVehicle.transmission}
                    onChange={(e) => setEditingVehicle(prev => ({ 
                      ...prev, 
                      transmission: e.target.value 
                    }))}
                    className="smarttax-select"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="cvt">CVT</option>
                  </select>
                </div>
              </div>
              
              <div className="form-col">
                <Input
                  label="CRSP Value (KES)"
                  type="number"
                  value={editingVehicle.crspValue}
                  onChange={(e) => setEditingVehicle(prev => ({ 
                    ...prev, 
                    crspValue: parseInt(e.target.value) 
                  }))}
                  required
                />
              </div>
              
              <div className="form-col">
                <Input
                  label="Trim Level (Optional)"
                  type="text"
                  value={editingVehicle.trim}
                  onChange={(e) => setEditingVehicle(prev => ({ 
                    ...prev, 
                    trim: e.target.value 
                  }))}
                />
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <Button 
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="success"
              onClick={handleSaveEdit}
              loading={loading}
            >
              Save Vehicle
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Vehicle"
        size="small"
      >
        <div className="delete-modal">
          <div className="modal-content">
            <div className="warning-icon">⚠️</div>
            <h3>Are you sure?</h3>
            <p>
              This will permanently delete the vehicle from the CRSP database. 
              This action cannot be undone.
            </p>
          </div>
          
          <div className="modal-actions">
            <Button 
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={confirmDelete}
              loading={loading}
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCRSP;