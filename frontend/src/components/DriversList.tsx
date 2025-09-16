import React, { useState, useEffect } from 'react';
import { Driver } from '../types/driver';
import { Link } from 'react-router-dom';
import './DriversList.css';

const DriversList: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since the backend doesn't have drivers endpoint yet
      const mockDrivers: Driver[] = [
        {
          _id: '1',
          driverName: 'John Smith',
          driverId: 'DRV001',
          phoneNumber: '+1234567890',
          email: 'john.smith@email.com',
          licenseNumber: 'DL12345678',
          vehicleNumber: 'MH01AB1234',
          vehicleType: 'truck',
          status: 'active',
          currentLocation: 'Mumbai Central',
          assignedRoute: 'Route A',
          totalDeliveries: 145,
          rating: 4.8,
          createdAt: '2025-01-15'
        },
        {
          _id: '2',
          driverName: 'Sarah Johnson',
          driverId: 'DRV002',
          phoneNumber: '+1234567891',
          email: 'sarah.johnson@email.com',
          licenseNumber: 'DL87654321',
          vehicleNumber: 'MH02CD5678',
          vehicleType: 'van',
          status: 'on_route',
          currentLocation: 'Andheri East',
          assignedRoute: 'Route B',
          totalDeliveries: 98,
          rating: 4.6,
          createdAt: '2025-02-20'
        },
        {
          _id: '3',
          driverName: 'Mike Wilson',
          driverId: 'DRV003',
          phoneNumber: '+1234567892',
          email: 'mike.wilson@email.com',
          licenseNumber: 'DL11223344',
          vehicleNumber: 'MH03EF9012',
          vehicleType: 'truck',
          status: 'inactive',
          currentLocation: 'Pune',
          assignedRoute: 'Route C',
          totalDeliveries: 67,
          rating: 4.2,
          createdAt: '2025-03-10'
        }
      ];
      setDrivers(mockDrivers);
    } catch (err) {
      setError('Failed to fetch drivers data');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: 'status-active', text: 'Active' },
      on_route: { class: 'status-on-route', text: 'On Route' },
      inactive: { class: 'status-inactive', text: 'Inactive' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getVehicleIcon = (vehicleType: string) => {
    const icons = {
      truck: '🚛',
      van: '🚐',
      motorcycle: '🏍️'
    };
    return icons[vehicleType as keyof typeof icons] || '🚛';
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    
    return stars.join('');
  };

  if (loading) return <div className="loading">Loading drivers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="drivers-container">
      <div className="drivers-header">
        <div className="header-info">
          <h2>🚛 Drivers Management</h2>
          <p>Manage and track all delivery drivers</p>
        </div>
        <Link to="/drivers/create" className="btn btn-primary">
          ➕ Add New Driver
        </Link>
      </div>

      <div className="drivers-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search drivers, ID, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on_route">On Route</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="drivers-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{drivers.length}</h3>
            <p>Total Drivers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{drivers.filter(d => d.status === 'active').length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚛</div>
          <div className="stat-info">
            <h3>{drivers.filter(d => d.status === 'on_route').length}</h3>
            <p>On Route</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{drivers.length > 0 ? (drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1) : '0'}</h3>
            <p>Avg Rating</p>
          </div>
        </div>
      </div>

      <div className="drivers-grid">
        {filteredDrivers.map((driver) => (
          <div key={driver._id} className="driver-card">
            <div className="driver-header">
              <div className="driver-avatar">
                <span className="avatar-text">{driver.driverName.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="driver-basic">
                <h3>{driver.driverName}</h3>
                <p className="driver-id">{driver.driverId}</p>
                {getStatusBadge(driver.status)}
              </div>
            </div>

            <div className="driver-details">
              <div className="detail-row">
                <span className="detail-label">📱 Phone:</span>
                <span className="detail-value">{driver.phoneNumber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{getVehicleIcon(driver.vehicleType)} Vehicle:</span>
                <span className="detail-value">{driver.vehicleNumber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📍 Location:</span>
                <span className="detail-value">{driver.currentLocation}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">🛣️ Route:</span>
                <span className="detail-value">{driver.assignedRoute}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📦 Deliveries:</span>
                <span className="detail-value">{driver.totalDeliveries}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">⭐ Rating:</span>
                <span className="detail-value">{getRatingStars(driver.rating)} {driver.rating}</span>
              </div>
            </div>

            <div className="driver-actions">
              <Link to={`/drivers/${driver._id}`} className="btn btn-secondary btn-sm">
                👁️ View
              </Link>
              <Link to={`/drivers/edit/${driver._id}`} className="btn btn-primary btn-sm">
                ✏️ Edit
              </Link>
              <button className="btn btn-success btn-sm">
                📞 Call
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="no-results">
          <h3>No drivers found</h3>
          <p>Try adjusting your search criteria or add a new driver.</p>
        </div>
      )}
    </div>
  );
};

export default DriversList;
