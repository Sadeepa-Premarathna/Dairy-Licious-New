import React, { useState, useEffect } from 'react';
import { MilkRecord } from '../types/milk';
import { Link } from 'react-router-dom';
import './RawMilkRecords.css';

const RawMilkRecords: React.FC = () => {
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [qualityFilter, setQualityFilter] = useState<string>('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // Mock data for raw milk records since we're focusing on UI
      const mockRecords: MilkRecord[] = [
        {
          _id: '1',
          farmerName: 'Rajesh Kumar',
          farmerId: 'FR001',
          quantity: 25.5,
          qualityGrade: 'A',
          fatContent: 4.2,
          pricePerLiter: 45,
          totalAmount: 1147.5,
          collectionPoint: 'Village Center - Pune',
          distributionStatus: 'collected',
          collectedBy: 'John Smith',
          notes: 'High quality milk, excellent fat content',
          createdAt: '2025-08-31T06:00:00Z'
        },
        {
          _id: '2',
          farmerName: 'Priya Patel',
          farmerId: 'FR002',
          quantity: 18.0,
          qualityGrade: 'B',
          fatContent: 3.8,
          pricePerLiter: 42,
          totalAmount: 756.0,
          collectionPoint: 'Main Road - Mumbai',
          distributionStatus: 'in_transit',
          collectedBy: 'Sarah Johnson',
          notes: 'Good quality, regular supplier',
          createdAt: '2025-08-31T07:30:00Z'
        },
        {
          _id: '3',
          farmerName: 'Amit Sharma',
          farmerId: 'FR003',
          quantity: 30.2,
          qualityGrade: 'A',
          fatContent: 4.5,
          pricePerLiter: 48,
          totalAmount: 1449.6,
          collectionPoint: 'Dairy Cooperative - Delhi',
          distributionStatus: 'delivered',
          collectedBy: 'Mike Wilson',
          notes: 'Premium quality organic milk',
          createdAt: '2025-08-31T05:15:00Z'
        },
        {
          _id: '4',
          farmerName: 'Sunita Devi',
          farmerId: 'FR004',
          quantity: 12.8,
          qualityGrade: 'C',
          fatContent: 3.2,
          pricePerLiter: 38,
          totalAmount: 486.4,
          collectionPoint: 'Village Square - Jaipur',
          distributionStatus: 'pending',
          collectedBy: 'David Brown',
          notes: 'Standard quality, needs improvement',
          createdAt: '2025-08-31T08:00:00Z'
        }
      ];
      setRecords(mockRecords);
    } catch (err) {
      setError('Failed to fetch raw milk records');
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.collectionPoint.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.distributionStatus === statusFilter;
    const matchesQuality = qualityFilter === 'all' || record.qualityGrade === qualityFilter;
    return matchesSearch && matchesStatus && matchesQuality;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      collected: { class: 'status-collected', text: 'Collected', icon: '✅' },
      in_transit: { class: 'status-in-transit', text: 'In Transit', icon: '🚛' },
      delivered: { class: 'status-delivered', text: 'Delivered', icon: '📦' },
      pending: { class: 'status-pending', text: 'Pending', icon: '⏳' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getQualityBadge = (grade: string) => {
    const qualityConfig = {
      A: { class: 'quality-a', text: 'Grade A', icon: '🥇' },
      B: { class: 'quality-b', text: 'Grade B', icon: '🥈' },
      C: { class: 'quality-c', text: 'Grade C', icon: '🥉' }
    };
    const config = qualityConfig[grade as keyof typeof qualityConfig] || qualityConfig.C;
    return (
      <span className={`quality-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getTotalStats = () => {
    const totalQuantity = filteredRecords.reduce((sum, record) => sum + record.quantity, 0);
    const totalAmount = filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0);
    const avgFatContent = filteredRecords.length > 0 
      ? filteredRecords.reduce((sum, record) => sum + (record.fatContent || 0), 0) / filteredRecords.length 
      : 0;
    
    return { totalQuantity, totalAmount, avgFatContent };
  };

  const stats = getTotalStats();

  if (loading) return <div className="loading">Loading raw milk records...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="raw-milk-container">
      <div className="raw-milk-header">
        <div className="header-info">
          <h2>🥛 Raw Milk Records</h2>
          <p>Track and manage fresh milk collection from farms</p>
        </div>
        <Link to="/raw-milk/create" className="btn btn-primary">
          ➕ Add New Record
        </Link>
      </div>

      <div className="raw-milk-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search farmer, ID, or collection point..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="collected">Collected</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={qualityFilter}
            onChange={(e) => setQualityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
        </div>
      </div>

      <div className="raw-milk-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{filteredRecords.length}</h3>
            <p>Total Records</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🥛</div>
          <div className="stat-info">
            <h3>{stats.totalQuantity.toFixed(1)}L</h3>
            <p>Total Quantity</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats.totalAmount.toFixed(2)}</h3>
            <p>Total Value</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧈</div>
          <div className="stat-info">
            <h3>{stats.avgFatContent.toFixed(1)}%</h3>
            <p>Avg Fat Content</p>
          </div>
        </div>
      </div>

      <div className="raw-milk-table-container">
        <table className="raw-milk-table">
          <thead>
            <tr>
              <th>Farmer Details</th>
              <th>Quantity</th>
              <th>Quality</th>
              <th>Fat Content</th>
              <th>Price/Liter</th>
              <th>Total Amount</th>
              <th>Collection Point</th>
              <th>Status</th>
              <th>Collected By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record._id} className="table-row">
                <td>
                  <div className="farmer-info">
                    <strong>{record.farmerName}</strong>
                    <span className="farmer-id">ID: {record.farmerId}</span>
                  </div>
                </td>
                <td>
                  <span className="quantity">{record.quantity}L</span>
                </td>
                <td>
                  {getQualityBadge(record.qualityGrade)}
                </td>
                <td>
                  <span className="fat-content">{record.fatContent || 'N/A'}%</span>
                </td>
                <td>
                  <span className="price">₹{record.pricePerLiter}</span>
                </td>
                <td>
                  <span className="total-amount">₹{record.totalAmount.toFixed(2)}</span>
                </td>
                <td>
                  <span className="collection-point">{record.collectionPoint}</span>
                </td>
                <td>
                  {getStatusBadge(record.distributionStatus)}
                </td>
                <td>
                  <span className="collected-by">{record.collectedBy}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/raw-milk/${record._id}`} className="btn btn-secondary btn-sm">
                      👁️
                    </Link>
                    <Link to={`/raw-milk/edit/${record._id}`} className="btn btn-primary btn-sm">
                      ✏️
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRecords.length === 0 && (
        <div className="no-results">
          <h3>No raw milk records found</h3>
          <p>Try adjusting your search criteria or add a new record.</p>
        </div>
      )}
    </div>
  );
};

export default RawMilkRecords;
