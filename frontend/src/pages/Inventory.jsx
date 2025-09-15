import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { Badge } from '../components/Badge.jsx';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    product: '',
    batchNo: '',
    quantity: 0,
    unitCost: 0,
    expiryDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, productsRes] = await Promise.all([
        api.get('/inventory/stock'),
        api.get('/products?isActive=true'),
      ]);
      
      setInventory(inventoryRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveStock = async (e) => {
    e.preventDefault();
    
    if (!formData.product) {
      toast.error('Please select a product');
      return;
    }
    if (!formData.batchNo.trim()) {
      toast.error('Please enter a batch number');
      return;
    }
    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    
    try {
      await api.post('/inventory/batches', {
        ...formData,
        quantity: parseInt(formData.quantity),
        unitCost: parseFloat(formData.unitCost),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
      });
      toast.success('Stock received successfully');
      setShowReceiveModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to receive stock');
    }
  };

  const resetForm = () => {
    setFormData({
      product: '',
      batchNo: '',
      quantity: 0,
      unitCost: 0,
      expiryDate: '',
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStockStatus = (item) => {
    if (item.onHand <= 0) return 'out-of-stock';
    if (item.onHand <= (item.product?.reorderLevel || 10)) return 'low-stock';
    return 'in-stock';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.product?.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.product?.category === filterCategory;
    const status = getStockStatus(item);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(inventory.map(item => item.product?.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-particle w-32 h-32 top-20 left-10 opacity-20"></div>
        <div className="floating-particle w-24 h-24 top-40 right-20 opacity-15"></div>
        <div className="floating-particle w-40 h-40 bottom-20 left-1/4 opacity-10"></div>
        <div className="floating-particle w-28 h-28 bottom-40 right-1/3 opacity-25"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="glass-card animate-fade-in-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  📦 Inventory Management
                </h1>
                <p className="text-gray-600">
                  Monitor stock levels, track expiry dates, and manage inventory efficiently
                </p>
              </div>
              
              <button 
                onClick={() => setShowReceiveModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Receive Stock
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <div className="glass-card animate-fade-in-up animation-delay-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map((item, index) => {
            const status = getStockStatus(item);
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            
            return (
              <div 
                key={item._id} 
                className={`glass-card group hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${(index % 8 + 1) * 200}ms` }}
              >
                {/* Product Image */}
                <div className="relative h-48 mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                  {item.product?.image ? (
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl text-gray-400">📦</div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={
                        status === 'out-of-stock' ? 'danger' : 
                        status === 'low-stock' ? 'warning' : 'success'
                      }
                      className="text-xs font-semibold"
                    >
                      {status === 'out-of-stock' ? 'Out of Stock' : 
                       status === 'low-stock' ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {item.product?.name || 'Unknown Product'}
                    </h3>
                    <p className="text-sm text-gray-500">{item.product?.category}</p>
                  </div>

                  {/* Stock Level Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Stock Level</span>
                      <span className="font-semibold text-gray-900">
                        {item.onHand} {item.product?.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          status === 'out-of-stock' ? 'bg-red-500' :
                          status === 'low-stock' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min((item.onHand / (item.product?.reorderLevel * 2 || 50)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Expiry Info */}
                  {daysUntilExpiry !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Expires in:</span>
                      <Badge 
                        variant={
                          daysUntilExpiry <= 7 ? 'danger' : 
                          daysUntilExpiry <= 30 ? 'warning' : 'default'
                        }
                        className="text-xs"
                      >
                        {daysUntilExpiry} days
                      </Badge>
                    </div>
                  )}

                  {/* Unit Cost */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Unit Cost:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.unitCost || 0)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInventory.length === 0 && (
          <div className="glass-card text-center py-12 animate-fade-in-up">
            <div className="text-6xl text-gray-300 mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Start by receiving some stock items'
              }
            </p>
            <button 
              onClick={() => setShowReceiveModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Receive Stock
            </button>
          </div>
        )}
      </div>

      {/* Receive Stock Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Receive Stock</h2>
                <button
                  onClick={() => setShowReceiveModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleReceiveStock} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product *
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {product.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Number *
                  </label>
                  <input
                    type="text"
                    value={formData.batchNo}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter batch number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitCost}
                    onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter unit cost"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowReceiveModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Receive Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;