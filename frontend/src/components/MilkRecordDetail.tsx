import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { milkApi } from '../services/api';
import { MilkRecord } from '../types/milk';
import './MilkRecordDetail.css';

const MilkRecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [record, setRecord] = useState<MilkRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        const record = await milkApi.getRecordById(id!);
        setRecord(record);
      } catch (err) {
        setError('Failed to fetch milk record');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecord();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!record || !window.confirm('Are you sure you want to delete this milk record?')) {
      return;
    }

    try {
      await milkApi.deleteRecord(record._id!);
      navigate('/');
    } catch (err) {
      setError('Failed to delete milk record');
      console.error(err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'collected': return 'status-collected';
      case 'in_transit': return 'status-transit';
      case 'delivered': return 'status-delivered';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  };

  const getQualityBadgeClass = (grade: string) => {
    switch (grade) {
      case 'A': return 'quality-a';
      case 'B': return 'quality-b';
      case 'C': return 'quality-c';
      default: return 'quality-default';
    }
  };

  if (loading) {
    return <div className="loading">Loading milk record...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate(-1)} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="not-found">
        <h2>Milk record not found</h2>
        <Link to="/" className="back-btn">Back to Records List</Link>
      </div>
    );
  }

  return (
    <div className="milk-record-detail">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        
        <div className="record-actions">
          <Link to={`/edit/${record._id}`} className="edit-btn">
            ✏️ Edit
          </Link>
          <button onClick={handleDelete} className="delete-btn">
            🗑️ Delete
          </button>
        </div>
      </div>

      <article className="record-content">
        <header className="record-header">
          <h1>Milk Collection Record</h1>
          
          <div className="record-meta">
            <div className="farmer-info">
              <span className="farmer-name">👤 {record.farmerName}</span>
              <span className="farmer-id">ID: {record.farmerId}</span>
            </div>
            
            <div className="status-info">
              <span className={`status ${getStatusBadgeClass(record.distributionStatus)}`}>
                {record.distributionStatus.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`quality ${getQualityBadgeClass(record.qualityGrade)}`}>
                Grade {record.qualityGrade}
              </span>
            </div>
          </div>

          <div className="date-info">
            <div>
              <strong>Collected:</strong> {new Date(record.createdAt!).toLocaleString()}
            </div>
            {record.updatedAt !== record.createdAt && (
              <div>
                <strong>Updated:</strong> {new Date(record.updatedAt!).toLocaleString()}
              </div>
            )}
          </div>
        </header>

        <div className="record-body">
          <div className="info-grid">
            <div className="info-section">
              <h3>Collection Details</h3>
              <div className="info-items">
                <div className="info-item">
                  <label>Quantity:</label>
                  <span className="quantity">{record.quantity} Liters</span>
                </div>
                <div className="info-item">
                  <label>Collection Point:</label>
                  <span>📍 {record.collectionPoint}</span>
                </div>
                <div className="info-item">
                  <label>Collected By:</label>
                  <span>{record.collectedBy}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Quality & Pricing</h3>
              <div className="info-items">
                <div className="info-item">
                  <label>Quality Grade:</label>
                  <span className={`quality-badge ${getQualityBadgeClass(record.qualityGrade)}`}>
                    Grade {record.qualityGrade}
                  </span>
                </div>
                {record.fatContent && (
                  <div className="info-item">
                    <label>Fat Content:</label>
                    <span>{record.fatContent}%</span>
                  </div>
                )}
                <div className="info-item">
                  <label>Price per Liter:</label>
                  <span>Rs. {record.pricePerLiter}</span>
                </div>
                <div className="info-item total">
                  <label>Total Amount:</label>
                  <span className="total-amount">Rs. {record.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {record.notes && (
            <div className="notes-section">
              <h3>Notes</h3>
              <div className="notes-content">
                {record.notes.split('\n').map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <div className="detail-navigation">
        <Link to="/" className="nav-link">← View All Records</Link>
        <Link to="/dashboard" className="nav-link">Dashboard →</Link>
      </div>
    </div>
  );
};

export default MilkRecordDetail;
