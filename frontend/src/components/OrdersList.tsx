import React, { useState, useEffect } from 'react';
import { Order } from '../types/order';
import { Link } from 'react-router-dom';
import './OrdersList.css';

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Mock data for orders since backend doesn't have orders endpoint yet
      const mockOrders: Order[] = [
        {
          _id: '1',
          orderId: 'ORD001',
          customerName: 'Raj Patel',
          customerPhone: '+919876543210',
          customerEmail: 'raj.patel@email.com',
          deliveryAddress: '123 Main St, Mumbai, Maharashtra',
          orderItems: [
            { productType: 'fresh_milk', quantity: 10, pricePerUnit: 50, totalPrice: 500 },
            { productType: 'yogurt', quantity: 5, pricePerUnit: 80, totalPrice: 400 }
          ],
          orderStatus: 'confirmed',
          totalQuantity: 15,
          totalAmount: 900,
          paymentStatus: 'paid',
          paymentMethod: 'upi',
          assignedDriver: 'John Smith',
          estimatedDelivery: '2025-09-01T10:00:00Z',
          createdAt: '2025-08-30T08:00:00Z'
        },
        {
          _id: '2',
          orderId: 'ORD002',
          customerName: 'Priya Sharma',
          customerPhone: '+919876543211',
          customerEmail: 'priya.sharma@email.com',
          deliveryAddress: '456 Park Ave, Delhi, Delhi',
          orderItems: [
            { productType: 'fresh_milk', quantity: 5, pricePerUnit: 50, totalPrice: 250 },
            { productType: 'cheese', quantity: 2, pricePerUnit: 200, totalPrice: 400 }
          ],
          orderStatus: 'processing',
          totalQuantity: 7,
          totalAmount: 650,
          paymentStatus: 'pending',
          paymentMethod: 'cash',
          assignedDriver: 'Sarah Johnson',
          estimatedDelivery: '2025-09-01T14:00:00Z',
          createdAt: '2025-08-30T09:30:00Z'
        },
        {
          _id: '3',
          orderId: 'ORD003',
          customerName: 'Amit Kumar',
          customerPhone: '+919876543212',
          customerEmail: 'amit.kumar@email.com',
          deliveryAddress: '789 Hill Road, Pune, Maharashtra',
          orderItems: [
            { productType: 'fresh_milk', quantity: 20, pricePerUnit: 50, totalPrice: 1000 },
            { productType: 'butter', quantity: 3, pricePerUnit: 150, totalPrice: 450 }
          ],
          orderStatus: 'shipped',
          totalQuantity: 23,
          totalAmount: 1450,
          paymentStatus: 'paid',
          paymentMethod: 'card',
          assignedDriver: 'Mike Wilson',
          estimatedDelivery: '2025-09-01T16:00:00Z',
          createdAt: '2025-08-30T07:15:00Z'
        }
      ];
      setOrders(mockOrders);
    } catch (err) {
      setError('Failed to fetch orders data');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending', icon: '⏳' },
      confirmed: { class: 'status-confirmed', text: 'Confirmed', icon: '✅' },
      processing: { class: 'status-processing', text: 'Processing', icon: '⚙️' },
      shipped: { class: 'status-shipped', text: 'Shipped', icon: '🚛' },
      delivered: { class: 'status-delivered', text: 'Delivered', icon: '📦' },
      cancelled: { class: 'status-cancelled', text: 'Cancelled', icon: '❌' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const paymentConfig = {
      pending: { class: 'payment-pending', text: 'Pending', icon: '⏳' },
      paid: { class: 'payment-paid', text: 'Paid', icon: '✅' },
      failed: { class: 'payment-failed', text: 'Failed', icon: '❌' },
      refunded: { class: 'payment-refunded', text: 'Refunded', icon: '↩️' }
    };
    const config = paymentConfig[status as keyof typeof paymentConfig] || paymentConfig.pending;
    return (
      <span className={`payment-badge ${config.class}`}>
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

  const getTotalStats = () => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = filteredOrders.filter(order => order.orderStatus === 'pending').length;
    const deliveredOrders = filteredOrders.filter(order => order.orderStatus === 'delivered').length;
    
    return { totalOrders, totalRevenue, pendingOrders, deliveredOrders };
  };

  const stats = getTotalStats();

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div className="header-info">
          <h2>📋 Orders Management</h2>
          <p>Track and manage customer orders and deliveries</p>
        </div>
        <Link to="/orders/create" className="btn btn-primary">
          ➕ Create New Order
        </Link>
      </div>

      <div className="orders-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search customer, order ID, or phone..."
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
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.deliveredOrders}</h3>
            <p>Delivered</p>
          </div>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Details</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Order Status</th>
              <th>Payment</th>
              <th>Driver</th>
              <th>Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="table-row">
                <td>
                  <div className="order-info">
                    <strong>{order.orderId}</strong>
                    <span className="order-date">{formatDate(order.createdAt || '')}</span>
                  </div>
                </td>
                <td>
                  <div className="customer-info">
                    <strong>{order.customerName}</strong>
                    <span className="customer-phone">{order.customerPhone}</span>
                  </div>
                </td>
                <td>
                  <div className="items-info">
                    <span className="items-count">{order.orderItems.length} items</span>
                    <span className="total-quantity">Qty: {order.totalQuantity}</span>
                  </div>
                </td>
                <td>
                  <span className="total-amount">₹{order.totalAmount.toFixed(2)}</span>
                </td>
                <td>
                  {getStatusBadge(order.orderStatus)}
                </td>
                <td>
                  <div className="payment-info">
                    {getPaymentBadge(order.paymentStatus)}
                    <span className="payment-method">{order.paymentMethod?.toUpperCase()}</span>
                  </div>
                </td>
                <td>
                  <span className="assigned-driver">{order.assignedDriver || 'Not assigned'}</span>
                </td>
                <td>
                  <span className="delivery-time">
                    {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'TBD'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                      👁️
                    </Link>
                    <Link to={`/orders/edit/${order._id}`} className="btn btn-primary btn-sm">
                      ✏️
                    </Link>
                    <Link to={`/tracking/${order.orderId}`} className="btn btn-success btn-sm">
                      📍
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="no-results">
          <h3>No orders found</h3>
          <p>Try adjusting your search criteria or create a new order.</p>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
