import React, { useState, useEffect } from 'react';
import { TrackingRecord } from '../types/tracking';
import { Link } from 'react-router-dom';
import './TrackingList.css';

const TrackingList: React.FC = () => {
  const [trackings, setTrackings] = useState<TrackingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTrackings();
  }, []);

  const fetchTrackings = async () => {
    try {
      setLoading(true);
      // Mock data for tracking since backend doesn't have tracking endpoint yet
      const mockTrackings: TrackingRecord[] = [
        {
          _id: '1',
          trackingId: 'TRK001',
          orderId: 'ORD001',
          driverId: 'DRV001',
          currentStatus: 'in_transit',
          currentLocation: {
            latitude: 19.0760,
            longitude: 72.8777,
            address: 'Mumbai Central, Mumbai, Maharashtra'
          },
          estimatedArrival: '2025-09-01T10:00:00Z',
          statusHistory: [
            {
              status: 'pickup',
              location: 'Warehouse - Andheri',
              timestamp: '2025-08-31T08:00:00Z',
              notes: 'Order picked up successfully'
            },
            {
              status: 'in_transit',
              location: 'Mumbai Central',
              timestamp: '2025-08-31T09:30:00Z',
              notes: 'On route to delivery location'
            }
          ],
          createdAt: '2025-08-31T08:00:00Z'
        },
        {
          _id: '2',
          trackingId: 'TRK002',
          orderId: 'ORD002',
          driverId: 'DRV002',
          currentStatus: 'out_for_delivery',
          currentLocation: {
            latitude: 28.6139,
            longitude: 77.2090,
            address: 'Connaught Place, Delhi, Delhi'
          },
          estimatedArrival: '2025-09-01T14:00:00Z',
          statusHistory: [
            {
              status: 'pickup',
              location: 'Warehouse - Gurgaon',
              timestamp: '2025-08-31T07:00:00Z',
              notes: 'Order picked up'
            },
            {
              status: 'in_transit',
              location: 'Delhi Border',
              timestamp: '2025-08-31T08:30:00Z',
              notes: 'Crossed Delhi border'
            },
            {
              status: 'out_for_delivery',
              location: 'Connaught Place',
              timestamp: '2025-08-31T10:00:00Z',
              notes: 'Out for delivery to customer'
            }
          ],
          createdAt: '2025-08-31T07:00:00Z'
        },
        {
          _id: '3',
          trackingId: 'TRK003',
          orderId: 'ORD003',
          driverId: 'DRV003',
          currentStatus: 'delivered',
          currentLocation: {
            latitude: 18.5204,
            longitude: 73.8567,
            address: 'Pune, Maharashtra'
          },
          estimatedArrival: '2025-08-31T16:00:00Z',
          statusHistory: [
            {
              status: 'pickup',
              location: 'Warehouse - Mumbai',
              timestamp: '2025-08-31T06:00:00Z',
              notes: 'Order picked up'
            },
            {
              status: 'in_transit',
              location: 'Mumbai-Pune Highway',
              timestamp: '2025-08-31T08:00:00Z',
              notes: 'On highway to Pune'
            },
            {
              status: 'out_for_delivery',
              location: 'Pune City',
              timestamp: '2025-08-31T14:00:00Z',
              notes: 'Reached Pune, out for delivery'
            },
            {
              status: 'delivered',
              location: 'Customer Address, Pune',
              timestamp: '2025-08-31T15:30:00Z',
              notes: 'Successfully delivered to customer'
            }
          ],
          createdAt: '2025-08-31T06:00:00Z'
        }
      ];
      setTrackings(mockTrackings);
    } catch (err) {
      setError('Failed to fetch tracking data');
      console.error('Error fetching trackings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrackings = trackings.filter(tracking => {
    const matchesSearch = tracking.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tracking.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tracking.currentLocation.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tracking.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pickup: { class: 'status-pickup', text: 'Pickup', icon: '📦' },
      in_transit: { class: 'status-in-transit', text: 'In Transit', icon: '🚛' },
      out_for_delivery: { class: 'status-out-for-delivery', text: 'Out for Delivery', icon: '🏃' },
      delivered: { class: 'status-delivered', text: 'Delivered', icon: '✅' },
      failed: { class: 'status-failed', text: 'Failed', icon: '❌' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pickup;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgress = (status: string) => {
    const statusProgress = {
      pickup: 25,
      in_transit: 50,
      out_for_delivery: 75,
      delivered: 100,
      failed: 0
    };
    return statusProgress[status as keyof typeof statusProgress] || 0;
  };

  const getTotalStats = () => {
    const totalTrackings = filteredTrackings.length;
    const inTransit = filteredTrackings.filter(t => t.currentStatus === 'in_transit').length;
    const outForDelivery = filteredTrackings.filter(t => t.currentStatus === 'out_for_delivery').length;
    const delivered = filteredTrackings.filter(t => t.currentStatus === 'delivered').length;
    
    return { totalTrackings, inTransit, outForDelivery, delivered };
  };

  const stats = getTotalStats();

  if (loading) return <div className="loading">Loading tracking data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <div className="header-info">
          <h2>📍 Live Tracking</h2>
          <p>Real-time tracking of orders and deliveries</p>
        </div>
        <Link to="/tracking/create" className="btn btn-primary">
          ➕ Add Tracking
        </Link>
      </div>

      <div className="tracking-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search tracking ID, order ID, or location..."
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
            <option value="pickup">Pickup</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="tracking-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalTrackings}</h3>
            <p>Total Shipments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚛</div>
          <div className="stat-info">
            <h3>{stats.inTransit}</h3>
            <p>In Transit</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏃</div>
          <div className="stat-info">
            <h3>{stats.outForDelivery}</h3>
            <p>Out for Delivery</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.delivered}</h3>
            <p>Delivered</p>
          </div>
        </div>
      </div>

      <div className="tracking-grid">
        {filteredTrackings.map((tracking) => (
          <div key={tracking._id} className="tracking-card">
            <div className="tracking-header-card">
              <div className="tracking-info">
                <h3>{tracking.trackingId}</h3>
                <p className="order-id">Order: {tracking.orderId}</p>
              </div>
              {getStatusBadge(tracking.currentStatus)}
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgress(tracking.currentStatus)}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {getProgress(tracking.currentStatus)}% Complete
              </div>
            </div>

            <div className="current-location">
              <div className="location-header">
                <span className="location-icon">📍</span>
                <strong>Current Location</strong>
              </div>
              <p>{tracking.currentLocation.address}</p>
            </div>

            {tracking.estimatedArrival && (
              <div className="estimated-arrival">
                <div className="arrival-header">
                  <span className="arrival-icon">⏰</span>
                  <strong>Estimated Arrival</strong>
                </div>
                <p>{formatDate(tracking.estimatedArrival)}</p>
              </div>
            )}

            <div className="status-history">
              <h4>📋 Status History</h4>
              <div className="history-timeline">
                {tracking.statusHistory.map((status, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-status">{status.status.replace('_', ' ').toUpperCase()}</div>
                      <div className="timeline-location">{status.location}</div>
                      <div className="timeline-time">{formatDate(status.timestamp)}</div>
                      {status.notes && <div className="timeline-notes">{status.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tracking-actions">
              <Link to={`/tracking/${tracking._id}`} className="btn btn-secondary btn-sm">
                👁️ View Details
              </Link>
              <Link to={`/orders/${tracking.orderId}`} className="btn btn-primary btn-sm">
                📋 View Order
              </Link>
              <button className="btn btn-success btn-sm">
                🗺️ Live Map
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTrackings.length === 0 && (
        <div className="no-results">
          <h3>No tracking records found</h3>
          <p>Try adjusting your search criteria or add a new tracking record.</p>
        </div>
      )}
    </div>
  );
};

export default TrackingList;
