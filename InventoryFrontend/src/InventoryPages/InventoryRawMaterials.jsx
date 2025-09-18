import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../api/axios.js';
import { Badge } from '../components/Badge.jsx';

function RawMaterials() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    supplier: {
      name: '',
      contact: '',
      email: ''
    },
    unit: 'kg',
    reorderLevel: 0,
    description: '',
    storageConditions: {
      temperature: '',
      humidity: '',
      specialRequirements: ''
    }
  });
  const [receiveData, setReceiveData] = useState({
    materialId: '',
    quantity: 0,
    unitCost: 0,
    batchNo: '',
    receivedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    supplier: '',
  });

  const categories = [
    'Feed',
    'Medicine',
    'Equipment',
    'Chemicals',
    'Supplements',
    'Packaging',
    'Other'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rawMaterials');
      setRawMaterials(response.data);
      
      // Extract unique suppliers from the raw materials
      const uniqueSuppliers = [...new Set(response.data.map(material => material.supplier?.name).filter(Boolean))];
      setSuppliers(uniqueSuppliers);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load raw materials data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/rawMaterials', formData);
      setRawMaterials([...rawMaterials, response.data]);
      toast.success('Raw material added successfully');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding material:', error);
      toast.error('Failed to add raw material');
    }
  };

  const handleReceiveMaterial = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post(`/rawMaterials/${receiveData.materialId}/receive`, {
        quantity: parseInt(receiveData.quantity),
        unitCost: parseFloat(receiveData.unitCost),
        batchNo: receiveData.batchNo,
        receivedDate: receiveData.receivedDate,
        expiryDate: receiveData.expiryDate,
        supplier: receiveData.supplier
      });
      
      // Update the material in the list
      setRawMaterials(materials => 
        materials.map(material => 
          material._id === receiveData.materialId ? response.data : material
        )
      );
      
      toast.success('Material received successfully');
      setShowReceiveModal(false);
      resetReceiveForm();
    } catch (error) {
      console.error('Error receiving material:', error);
      toast.error('Failed to receive material');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      supplier: {
        name: '',
        contact: '',
        email: ''
      },
      unit: 'kg',
      reorderLevel: 0,
      description: '',
      storageConditions: {
        temperature: '',
        humidity: '',
        specialRequirements: ''
      }
    });
  };

  const resetReceiveForm = () => {
    setReceiveData({
      materialId: '',
      quantity: 0,
      unitCost: 0,
      batchNo: '',
      receivedDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      supplier: '',
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStockStatus = (material) => {
    if (material.currentStock <= 0) return 'out-of-stock';
    if (material.currentStock <= material.reorderLevel) return 'low-stock';
    return 'in-stock';
  };

  // Export functions
  const exportToExcel = () => {
    const exportData = filteredMaterials.map(material => ({
      'Material Name': material.name,
      'Category': material.category,
      'Stock on Hand': material.currentStock || 0,
      'Unit': material.unit,
      'Unit Cost (Rs.)': material.unitCost || 0,
      'Supplier': material.supplier?.name || 'N/A',
      'Reorder Level': material.reorderLevel,
      'Stock Status': getStockStatus(material).replace('-', ' ').toUpperCase(),
      'Last Received': material.lastReceived ? new Date(material.lastReceived).toLocaleDateString() : 'N/A',
      'Expiry Date': material.expiryDate ? new Date(material.expiryDate).toLocaleDateString() : 'N/A',
      'Description': material.description || 'N/A'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Raw Materials');
    
    // Auto-size columns
    const colWidths = [];
    const keys = Object.keys(exportData[0] || {});
    keys.forEach(key => {
      const maxLength = Math.max(
        key.length,
        ...exportData.map(row => String(row[key] || '').length)
      );
      colWidths.push({ wch: Math.min(maxLength + 2, 50) });
    });
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `Raw_Materials_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel file downloaded successfully!');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Raw Materials Report', 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Prepare table data
    const tableData = filteredMaterials.map(material => [
      material.name,
      material.category,
      material.currentStock || 0,
      material.unit,
      `Rs. ${material.unitCost || 0}`,
      material.supplier?.name || 'N/A',
      getStockStatus(material).replace('-', ' ').toUpperCase()
    ]);

    // Add table
    doc.autoTable({
      head: [['Material', 'Category', 'Stock', 'Unit', 'Cost', 'Supplier', 'Status']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [147, 51, 234] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 40 },
    });

    doc.save(`Raw_Materials_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF file downloaded successfully!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredMaterials = rawMaterials.filter(material => {
    const matchesSearch = material.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         material.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || material.category === filterCategory;
    const status = getStockStatus(material);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = [...new Set(rawMaterials.map(material => material.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading raw materials data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-particle w-32 h-32 top-20 left-10 opacity-20" style={{background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.6))'}}></div>
        <div className="floating-particle w-24 h-24 top-40 right-20 opacity-15" style={{background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.6))'}}></div>
        <div className="floating-particle w-40 h-40 bottom-20 left-1/4 opacity-10" style={{background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.6))'}}></div>
        <div className="floating-particle w-28 h-28 bottom-40 right-1/3 opacity-25" style={{background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.6))'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="glass-card animate-fade-in-up">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🧪 Raw Materials Management
                </h1>
                <p className="text-gray-600">
                  Track raw materials, manage suppliers, and monitor inventory levels
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Export Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={exportToExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Excel
                  </button>
                  
                  <button 
                    onClick={exportToPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    PDF
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                    Add Material
                  </button>
                  <button 
                    onClick={() => setShowReceiveModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                      <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    Receive Stock
                  </button>
                </div>
              </div>
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
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.map((material, index) => {
            const status = getStockStatus(material);
            const daysUntilExpiry = getDaysUntilExpiry(material.expiryDate);
            
            return (
              <div 
                key={material._id} 
                className={`glass-card group hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${(index % 8 + 1) * 200}ms` }}
              >
                {/* Material Icon */}
                <div className="relative h-48 mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="text-6xl">
                    {material.category === 'Feed' && '🌾'}
                    {material.category === 'Medicine' && '�'}
                    {material.category === 'Equipment' && '🔧'}
                    {material.category === 'Chemicals' && '🧪'}
                    {material.category === 'Supplements' && '�'}
                    {material.category === 'Packaging' && '📦'}
                    {!['Feed', 'Medicine', 'Equipment', 'Chemicals', 'Supplements', 'Packaging'].includes(material.category) && '📋'}
                  </div>
                  
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

                {/* Material Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                      {material.name}
                    </h3>
                    <p className="text-sm text-gray-500">{material.category}</p>
                    <p className="text-xs text-gray-400">{material.supplier?.name || 'N/A'}</p>
                  </div>

                  {/* Stock Level Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Stock Level</span>
                      <span className="font-semibold text-gray-900">
                        {material.currentStock || 0} {material.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          status === 'out-of-stock' ? 'bg-red-500' :
                          status === 'low-stock' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(((material.currentStock || 0) / (material.reorderLevel * 2 || 50)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Reorder: {material.reorderLevel}</span>
                      <span>{Math.round(((material.currentStock || 0) / (material.reorderLevel * 2 || 50)) * 100)}%</span>
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
                      {formatCurrency(material.unitCost || 0)}
                    </span>
                  </div>

                  {/* Last Received */}
                  {material.lastReceived && (
                    <div className="text-xs text-gray-500 text-center">
                      Last received: {new Date(material.lastReceived).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="glass-card text-center py-12 animate-fade-in-up">
            <div className="text-6xl text-gray-300 mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No raw materials found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search terms'
                : 'Start by adding some raw materials'
              }
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Add Raw Material
            </button>
          </div>
        )}
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Raw Material</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddMaterial} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter material name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="kg">Kilograms</option>
                      <option value="Liters">Liters</option>
                      <option value="Units">Units</option>
                      <option value="Packets">Packets</option>
                      <option value="Boxes">Boxes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reorder Level *
                    </label>
                    <input
                      type="number"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={formData.supplier.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      supplier: { ...formData.supplier, name: e.target.value } 
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter supplier name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier Contact
                    </label>
                    <input
                      type="text"
                      value={formData.supplier.contact}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        supplier: { ...formData.supplier, contact: e.target.value } 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Contact number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier Email
                    </label>
                    <input
                      type="email"
                      value={formData.supplier.email}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        supplier: { ...formData.supplier, email: e.target.value } 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="supplier@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Storage Conditions
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.storageConditions.temperature}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        storageConditions: { ...formData.storageConditions, temperature: e.target.value } 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Temperature range"
                    />
                    <input
                      type="text"
                      value={formData.storageConditions.humidity}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        storageConditions: { ...formData.storageConditions, humidity: e.target.value } 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Humidity level"
                    />
                  </div>
                  <textarea
                    value={formData.storageConditions.specialRequirements}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      storageConditions: { ...formData.storageConditions, specialRequirements: e.target.value } 
                    })}
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 mt-2"
                    placeholder="Special storage requirements"
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Add Material
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receive Material Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Receive Material</h2>
                <button
                  onClick={() => setShowReceiveModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleReceiveMaterial} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material *
                  </label>
                  <select
                    value={receiveData.materialId}
                    onChange={(e) => setReceiveData({ ...receiveData, materialId: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select material</option>
                    {rawMaterials.map((material) => (
                      <option key={material._id} value={material._id}>
                        {material.name} - {material.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={receiveData.quantity}
                      onChange={(e) => setReceiveData({ ...receiveData, quantity: e.target.value })}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Cost *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={receiveData.unitCost}
                      onChange={(e) => setReceiveData({ ...receiveData, unitCost: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={receiveData.batchNo}
                    onChange={(e) => setReceiveData({ ...receiveData, batchNo: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter batch number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Received Date *
                  </label>
                  <input
                    type="date"
                    value={receiveData.receivedDate}
                    onChange={(e) => setReceiveData({ ...receiveData, receivedDate: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={receiveData.expiryDate}
                    onChange={(e) => setReceiveData({ ...receiveData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                    Receive Material
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

export default RawMaterials;
