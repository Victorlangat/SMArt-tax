import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/components/sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard', exact: true },
    { path: '/vehicle-lookup', icon: '🔍', label: 'Vehicle Lookup' },
    { path: '/tax-calculator', icon: '🧮', label: 'Tax Calculator' },
    { path: '/document-verification', icon: '📄', label: 'Document Verification' },
    { path: '/reports', icon: '📋', label: 'Reports' },
    { path: '/admin-crsp', icon: '⚙️', label: 'CRSP Admin', admin: true },
    { path: '/audit-log', icon: '📊', label: 'Audit Log', admin: true },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <aside className="smarttax-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Navigation</h3>
      </div>
      
      <nav className="sidebar-menu">
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                end={item.exact}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                {item.admin && <span className="admin-badge">Admin</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-label">Calculations Today</span>
            <span className="stat-value">24</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Accuracy Rate</span>
            <span className="stat-value">98.5%</span>
          </div>
        </div>
        <div className="sidebar-help">
          <a href="/help" className="help-link">Need Help?</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;