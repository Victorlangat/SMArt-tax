import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleLookup from './pages/VehicleLookup';
import TaxCalculator from './pages/TaxCalculator';
import DocumentVerification from './components/document/DocumentVerification';
import Reports from './pages/Reports';
import AdminCRSP from './pages/AdminCRSP';
import Settings from './pages/Settings';
import AuditLog from './pages/AuditLog';
import './styles/main.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smarttax_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading SmartTax...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout Component for protected routes
const MainLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('smarttax_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/vehicle-lookup" element={
            <ProtectedRoute>
              <MainLayout>
                <VehicleLookup />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/tax-calculator" element={
            <ProtectedRoute>
              <MainLayout>
                <TaxCalculator />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/document-verification" element={
            <ProtectedRoute>
              <MainLayout>
                <DocumentVerification />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <MainLayout>
                <Reports />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin-crsp" element={
            <ProtectedRoute>
              <MainLayout>
                <AdminCRSP />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/audit-log" element={
            <ProtectedRoute>
              <MainLayout>
                <AuditLog />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Default Redirect */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
          
          {/* 404 Page */}
          <Route path="*" element={
            <ProtectedRoute>
              <MainLayout>
                <div className="not-found">
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/dashboard" className="btn btn-primary">
                    Go to Dashboard
                  </a>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;