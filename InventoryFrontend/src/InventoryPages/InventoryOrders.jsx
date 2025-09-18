import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import Table from '../components/Table.jsx';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orderItems, setOrderItems] = useState([{ product: '', qty: 1 }]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, stockRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products?isActive=true'),
        api.get('/inventory/stock'),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setStock(stockRes.data);
    } catch (error) {
      toast.error('Failed to load orders data');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStock = (productId) => {
    const stockItem = stock.find(s => s.product._id === productId);
    return stockItem ? stockItem.onHand : 0;
  };

  const getProductPrice = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.price : 0;
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const price = getProductPrice(item.product);
      return total + (item.qty * price);
    }, 0);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    // Validate items
    const validItems = orderItems.filter(item => item.product && item.qty > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one item to the order');
      return;
    }

    // Check stock availability
    for (const item of validItems) {
      const available = getAvailableStock(item.product);
      if (item.qty > available) {
        const product = products.find(p => p._id === item.product);
        toast.error(`Insufficient stock for ${product?.name}. Available: ${available}`);
        return;
      }
    }

    try {
      const orderData = {
        items: validItems.map(item => ({
          product: item.product,
          qty: item.qty,
          priceAtSale: getProductPrice(item.product),
        })),
        notes,
      };

      const response = await api.post('/orders', orderData);
      toast.success(`Order created successfully! Order ID: ${response.data._id}`);
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product: '', qty: 1 }]);
  };

  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  };

  const resetForm = () => {
    setOrderItems([{ product: '', qty: 1 }]);
    setNotes('');
  };

  const orderColumns = [
    { key: 'createdAt', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'items', label: 'Items', render: (value) => value?.length || 0 },
    { key: 'total', label: 'Total', render: (value) => `$${value?.toFixed(2) || '0.00'}` },
    { key: 'notes', label: 'Notes', render: (value) => value || '-' },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <button
        onClick={() => handleDeleteOrder(row)}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Delete
      </button>
    )},
  ];

  const handleDeleteOrder = async (order) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await api.delete(`/orders/${order._id}`);
      toast.success('Order deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  if (loading) {
    return <div className="card">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          Create Order
        </button>
      </div>

      {/* Orders List */}
      <Table
        data={orders}
        columns={orderColumns}
        searchable
        searchFields={['notes']}
        pagination
        itemsPerPage={10}
      />

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Order</h2>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Order Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Items</label>
                {orderItems.map((item, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <select
                      value={item.product}
                      onChange={(e) => updateOrderItem(index, 'product', e.target.value)}
                      className="input flex-1"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} (Stock: {getAvailableStock(product._id)})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateOrderItem(index, 'qty', parseInt(e.target.value) || 0)}
                      className="input w-20"
                      min="1"
                      max={item.product ? getAvailableStock(item.product) : 999}
                      required
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      Rs. ${item.product ? (getProductPrice(item.product) * item.qty).toFixed(2) : '0.00'}
                    </span>
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOrderItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOrderItem}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Item
                </button>
              </div>

              {/* Total */}
              <div className="text-right">
                <span className="text-lg font-semibold">
                  Total: ${calculateTotal().toFixed(2)}
                </span>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input"
                  rows="3"
                  placeholder="Optional notes for this order..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
