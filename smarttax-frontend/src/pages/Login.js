import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import '../styles/pages/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (formData.email && formData.password) {
        // Store auth token in localStorage (simulated)
        localStorage.setItem('smarttax_token', 'simulated_token_12345');
        localStorage.setItem('smarttax_user', JSON.stringify({
          name: 'Leonard Kariuki',
          email: formData.email,
          role: 'importer'
        }));
        
        navigate('/dashboard');
      } else {
        setError('Please enter email and password');
      }
      setLoading(false);
    }, 1500);
  };

  const handleDemoLogin = (role) => {
    setLoading(true);
    
    // Simulate different user roles
    setTimeout(() => {
      localStorage.setItem('smarttax_token', `demo_token_${role}`);
      localStorage.setItem('smarttax_user', JSON.stringify({
        name: role === 'admin' ? 'Admin User' : 'Demo Importer',
        email: `${role}@smarttax.com`,
        role: role
      }));
      
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-logo">
              <span className="logo-icon">ST</span>
              <div className="logo-text">
                <h1>SmartTax</h1>
                <p className="tagline">Fair Valuation. Trusted Nation.</p>
              </div>
            </div>
            
            <div className="login-features">
              <h2>Transparent Vehicle Import Tax Evaluation</h2>
              <div className="features-list">
                <div className="feature">
                  <span className="feature-icon">🧮</span>
                  <div className="feature-text">
                    <h4>Accurate Tax Calculation</h4>
                    <p>Based on KRA 2025 CRSP guidelines</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔍</span>
                  <div className="feature-text">
                    <h4>Document Verification</h4>
                    <p>Automated invoice and CRSP matching</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <div className="feature-text">
                    <h4>Detailed Reports</h4>
                    <p>PDF/CSV reports for KRA compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <Card className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your SmartTax account</p>
            </div>

            {error && (
              <div className="login-error">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  icon="✉️"
                />
              </div>

              <div className="form-group">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  icon="🔒"
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                fullWidth
                className="login-button"
              >
                Sign In
              </Button>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="demo-login">
                <h4>Demo Accounts</h4>
                <div className="demo-buttons">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleDemoLogin('importer')}
                    disabled={loading}
                  >
                    Importer Demo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={loading}
                  >
                    Admin Demo
                  </Button>
                </div>
              </div>

              <div className="signup-link">
                <p>
                  Don't have an account?{' '}
                  <a href="/signup" className="signup">
                    Request Access
                  </a>
                </p>
              </div>
            </form>

            <div className="login-footer">
              <p className="disclaimer">
                By signing in, you agree to our{' '}
                <a href="/terms">Terms of Service</a> and{' '}
                <a href="/privacy">Privacy Policy</a>
              </p>
            </div>
          </Card>

          <div className="login-info">
            <p className="support">
              <strong>Need help?</strong> Contact support: support@smarttax.com
            </p>
            <p className="version">SmartTax System v1.0 • 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;