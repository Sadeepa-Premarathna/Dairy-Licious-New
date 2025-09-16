import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { milkApi } from '../services/api';
import { MilkRecord } from '../types/milk';
import './MilkRecordList.css';

const MilkRecordList: React.FC = () => {
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [farmerNameFilter, setFarmerNameFilter] = useState<string>('');
  const [collectionPointFilter, setCollectionPointFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const statusOptions = ['collected', 'in_transit', 'delivered', 'pending'];

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await milkApi.getAllRecords(
        page,
        10,
        farmerNameFilter || undefined,
        collectionPointFilter || undefined,
        statusFilter || undefined
      );
      setRecords(response.records);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch milk records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, farmerNameFilter, collectionPointFilter, statusFilter]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFilterChange = () => {
    setPage(1);
    fetchRecords();
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
    return <div className="loading">Loading milk records...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="milk-record-list">
      <div className="list-header">
        <h2>Milk Collection Records</h2>
        <p>Track and manage milk collection and distribution</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by farmer name..."
            value={farmerNameFilter}
            onChange={(e) => setFarmerNameFilter(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by collection point..."
            value={collectionPointFilter}
            onChange={(e) => setCollectionPointFilter(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleFilterChange} className="filter-btn">
          Apply Filters
        </button>
      </div>

      <div className="records-grid">
        {records.length === 0 ? (
          <div className="no-records">
            <p>No milk records found.</p>
            <Link to="/create" className="create-first-btn">
              Create First Record
            </Link>
          </div>
        ) : (
          records.map((record) => (
            <div key={record._id} className="record-card">
              <div className="card-header">
                <h3>{record.farmerName}</h3>
                <div className="card-badges">
                  <span className={`status-badge ${getStatusBadgeClass(record.distributionStatus)}`}>
                    {record.distributionStatus.replace('_', ' ')}
                  </span>
                  <span className={`quality-badge ${getQualityBadgeClass(record.qualityGrade)}`}>
                    Grade {record.qualityGrade}
                  </span>
                </div>
              </div>
              
              <div className="card-content">
                <div className="record-info">
                  <div className="info-item">
                    <label>Farmer ID:</label>
                    <span>{record.farmerId}</span>
                  </div>
                  <div className="info-item">
                    <label>Quantity:</label>
                    <span>{record.quantity} L</span>
                  </div>
                  <div className="info-item">
                    <label>Price/L:</label>
                    <span>Rs. {record.pricePerLiter}</span>
                  </div>
                  <div className="info-item">
                    <label>Total:</label>
                    <span className="total-amount">Rs. {record.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="card-meta">
                <div className="collection-info">
                  <span className="collection-point">📍 {record.collectionPoint}</span>
                  <span className="collected-by">👤 {record.collectedBy}</span>
                </div>
                <div className="date">
                  {new Date(record.createdAt!).toLocaleDateString()}
                </div>
              </div>

              <div className="card-actions">
                <Link to={`/record/${record._id}`} className="view-btn">
                  View Details
                </Link>
                <Link to={`/edit/${record._id}`} className="edit-btn">
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="page-btn"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MilkRecordList;
