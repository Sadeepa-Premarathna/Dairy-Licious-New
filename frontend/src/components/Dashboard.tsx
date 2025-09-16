import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { milkApi } from '../services/api';
import { MilkRecord, SummaryStats } from '../types/milk';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [recentRecords, setRecentRecords] = useState<MilkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryData, recordsData] = await Promise.all([
          milkApi.getSummaryStats(),
          milkApi.getAllRecords(1, 5)
        ]);
        setSummary(summaryData);
        setRecentRecords(recordsData.records);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'collected': return 'status-collected';
      case 'in_transit': return 'status-transit';
      case 'delivered': return 'status-delivered';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Overview of milk collection and distribution</p>
      </div>

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Total Records</div>
              <div className="stat-number">{summary.totalRecords}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🥛</div>
            <div className="stat-content">
              <div className="stat-label">Total Quantity</div>
              <div className="stat-number">{summary.totalQuantity.toFixed(1)}L</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Total Amount</div>
              <div className="stat-number">Rs. {summary.totalAmount.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">Avg Price/Liter</div>
              <div className="stat-number">
                Rs. {summary.totalQuantity > 0 ? (summary.totalAmount / summary.totalQuantity).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>
      )}

      {summary && summary.statusBreakdown && (
        <div className="status-breakdown">
          <h3>Distribution Status</h3>
          <div className="status-grid">
            {summary.statusBreakdown.map((item: any) => (
              <div key={item._id} className="status-item">
                <div className="status-label">{item._id}</div>
                <div className="status-count">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}      <div className="recent-records">
        <div className="section-header">
          <h3>Recent Records</h3>
          <Link to="/" className="view-all-btn">View All</Link>
        </div>
        
        {recentRecords.length === 0 ? (
          <div className="no-records">
            <p>No records found.</p>
            <Link to="/create" className="create-btn">Create First Record</Link>
          </div>
        ) : (
          <div className="records-list">
            {recentRecords.map((record) => (
              <div key={record._id} className="record-summary">
                <div className="record-info">
                  <div className="farmer-name">{record.farmerName}</div>
                  <div className="record-details">
                    {record.quantity}L • Rs. {record.totalAmount} • {record.collectionPoint}
                  </div>
                </div>
                <div className="record-meta">
                  <span className={`status-badge ${getStatusBadgeClass(record.distributionStatus)}`}>
                    {record.distributionStatus.replace('_', ' ')}
                  </span>
                  <div className="record-date">
                    {new Date(record.createdAt!).toLocaleDateString()}
                  </div>
                </div>
                <div className="record-actions">
                  <Link to={`/record/${record._id}`} className="view-btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/create" className="action-btn primary">
            📝 New Collection Record
          </Link>
          <Link to="/" className="action-btn secondary">
            📋 View All Records
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
