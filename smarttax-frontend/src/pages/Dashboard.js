import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentCalculations from '../components/dashboard/RecentCalculations';
import QuickActions from '../components/dashboard/QuickActions';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = () => {
      setTimeout(() => {
        const storedUser = localStorage.getItem('smarttax_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Sample recent activity
        setRecentActivity([
          { id: 1, action: 'Tax Calculation', vehicle: 'Suzuki Swift', time: '2 hours ago' },
          { id: 2, action: 'Document Upload', vehicle: 'Toyota Vitz', time: '4 hours ago' },
          { id: 3, action: 'Report Generated', vehicle: 'Mazda Demio', time: '1 day ago' },
          { id: 4, action: 'Vehicle Lookup', vehicle: 'Lexus LX570', time: '2 days ago' },
          { id: 5, action: 'CRSP Update', vehicle: 'All Models', time: '3 days ago' },
        ]);
        
        setLoading(false);
      }, 1000);
    };

    fetchUserData();
  }, []);

  const handleNewCalculation = () => {
    // Navigate to vehicle lookup
    window.location.href = '/vehicle-lookup';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header 
        title="Dashboard"
        subtitle="Welcome back, {user?.name || 'User'}. Here's your SmartTax overview."
        actions={
          <Button 
            variant="success" 
            icon="🧮"
            onClick={handleNewCalculation}
          >
            New Calculation
          </Button>
        }
        breadcrumbs={['Home', 'Dashboard']}
      />
      
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-content">
              <div className="welcome-text">
                <h2>SmartTax Vehicle Import System</h2>
                <p>Transparent, accurate tax evaluation for imported vehicles in Kenya</p>
              </div>
              <div className="welcome-actions">
                <Button variant="outline" icon="📚">
                  View Tutorial
                </Button>
                <Button variant="primary" icon="🚀">
                  Quick Start Guide
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3 className="section-title">
                <span className="section-icon">📊</span>
                System Overview
              </h3>
              <span className="section-subtitle">Real-time statistics and metrics</span>
            </div>
            <DashboardStats />
          </div>

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            <div className="grid-column">
              <div className="dashboard-section">
                <RecentCalculations />
              </div>
              
              <div className="dashboard-section">
                <Card title="KRA Updates" icon="📢" padding>
                  <div className="kra-updates">
                    <div className="update-item critical">
                      <div className="update-header">
                        <span className="update-badge">CRSP Update</span>
                        <span className="update-date">July 2025</span>
                      </div>
                      <p className="update-text">
                        Major CRSP update implemented. Suzuki Swift taxes increased by 145%.
                      </p>
                      <a href="#" className="update-link">View Details →</a>
                    </div>
                    
                    <div className="update-item warning">
                      <div className="update-header">
                        <span className="update-badge">Policy Change</span>
                        <span className="update-date">June 2025</span>
                      </div>
                      <p className="update-text">
                        New document verification requirements for all imports.
                      </p>
                      <a href="#" className="update-link">Learn More →</a>
                    </div>
                    
                    <div className="update-item info">
                      <div className="update-header">
                        <span className="update-badge">System Update</span>
                        <span className="update-date">May 2025</span>
                      </div>
                      <p className="update-text">
                        SmartTax now supports 5,200+ vehicle models in CRSP database.
                      </p>
                      <a href="#" className="update-link">Read More →</a>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid-column">
              <div className="dashboard-section">
                <QuickActions />
              </div>
              
              <div className="dashboard-section">
                <Card title="Recent Activity" icon="📝" padding>
                  <div className="recent-activity">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">
                          {activity.action.includes('Calculation') ? '🧮' :
                           activity.action.includes('Upload') ? '📤' :
                           activity.action.includes('Report') ? '📋' :
                           activity.action.includes('Lookup') ? '🔍' : '⚙️'}
                        </div>
                        <div className="activity-content">
                          <div className="activity-title">
                            <span className="activity-action">{activity.action}</span>
                            <span className="activity-time">{activity.time}</span>
                          </div>
                          <div className="activity-details">
                            <span className="activity-vehicle">{activity.vehicle}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="activity-footer">
                    <Button variant="outline" size="small">
                      View All Activity
                    </Button>
                  </div>
                </Card>
              </div>
              
              <div className="dashboard-section">
                <Card title="System Status" icon="🟢" padding>
                  <div className="system-status">
                    <div className="status-item">
                      <div className="status-indicator active"></div>
                      <div className="status-info">
                        <span className="status-name">CRSP Database</span>
                        <span className="status-details">5,200+ models, Updated daily</span>
                      </div>
                    </div>
                    <div className="status-item">
                      <div className="status-indicator active"></div>
                      <div className="status-info">
                        <span className="status-name">Tax Calculator</span>
                        <span className="status-details">Running, 98.5% accuracy</span>
                      </div>
                    </div>
                    <div className="status-item">
                      <div className="status-indicator active"></div>
                      <div className="status-info">
                        <span className="status-name">Document Verification</span>
                        <span className="status-details">Active, AI-powered</span>
                      </div>
                    </div>
                    <div className="status-item">
                      <div className="status-indicator maintenance"></div>
                      <div className="status-info">
                        <span className="status-name">Report Generation</span>
                        <span className="status-details">Maintenance scheduled</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;