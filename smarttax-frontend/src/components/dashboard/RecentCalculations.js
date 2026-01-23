import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import '../../styles/pages/dashboard.css';

const RecentCalculations = () => {
  const calculations = [
    {
      id: 'CALC-001',
      vehicle: 'Suzuki Swift 1.2L (2018)',
      date: '2025-01-15',
      totalTax: 'KES 623,503',
      status: 'Verified',
      match: '95%'
    },
    {
      id: 'CALC-002',
      vehicle: 'Toyota Vitz Hybrid F',
      date: '2025-01-14',
      totalTax: 'KES 580,000',
      status: 'Disputed',
      match: '87%'
    },
    {
      id: 'CALC-003',
      vehicle: 'Mazda Demio 1.5L',
      date: '2025-01-13',
      totalTax: 'KES 467,350',
      status: 'Verified',
      match: '98%'
    },
    {
      id: 'CALC-004',
      vehicle: 'Toyota Premio 2.0G',
      date: '2025-01-12',
      totalTax: 'KES 1,200,000',
      status: 'Pending',
      match: '92%'
    },
    {
      id: 'CALC-005',
      vehicle: 'Lexus LX570',
      date: '2025-01-11',
      totalTax: 'KES 3,410,000',
      status: 'Verified',
      match: '96%'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Verified': { class: 'status-verified', label: 'Verified' },
      'Disputed': { class: 'status-disputed', label: 'Disputed' },
      'Pending': { class: 'status-pending', label: 'Pending' }
    };
    
    const config = statusConfig[status];
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <Card title="Recent Calculations" icon="📊" padding>
      <div className="recent-calculations">
        <div className="calculations-table">
          <div className="table-header">
            <div className="table-cell">ID</div>
            <div className="table-cell">Vehicle</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Total Tax</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">CRSP Match</div>
            <div className="table-cell">Actions</div>
          </div>
          
          {calculations.map((calc) => (
            <div key={calc.id} className="table-row">
              <div className="table-cell cell-id">
                <span className="cell-value">{calc.id}</span>
              </div>
              <div className="table-cell cell-vehicle">
                <span className="cell-value">{calc.vehicle}</span>
              </div>
              <div className="table-cell cell-date">
                <span className="cell-value">{calc.date}</span>
              </div>
              <div className="table-cell cell-tax">
                <span className="cell-value">{calc.totalTax}</span>
              </div>
              <div className="table-cell cell-status">
                {getStatusBadge(calc.status)}
              </div>
              <div className="table-cell cell-match">
                <div className="match-bar">
                  <div 
                    className="match-fill" 
                    style={{ width: `${calc.match}` }}
                  ></div>
                  <span className="match-percentage">{calc.match}</span>
                </div>
              </div>
              <div className="table-cell cell-actions">
                <Button 
                  variant="outline" 
                  size="small"
                  className="action-btn"
                >
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="small"
                  className="action-btn"
                >
                  Export
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="calculations-footer">
          <Button variant="outline">View All Calculations</Button>
        </div>
      </div>
    </Card>
  );
};

export default RecentCalculations;