import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import Table from '../components/Table.jsx';
import ChartCard from '../components/ChartCard.jsx';
import StatCard from '../components/StatCard.jsx';

export default function MilkCollections() {
  const [collections, setCollections] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    farmerName: '',
    farmerId: '',
    liters: 0,
    fatPercent: 0,
    pricePerLiter: 0,
    amountPaid: 0,
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collectionsRes, statsRes] = await Promise.all([
        api.get('/milk'),
        api.get('/milk/stats'),
      ]);
      setCollections(collectionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load milk collections data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollection = async (e) => {
    e.preventDefault();
    try {
      await api.post('/milk', {
        ...formData,
        liters: parseFloat(formData.liters),
        fatPercent: parseFloat(formData.fatPercent),
        pricePerLiter: parseFloat(formData.pricePerLiter),
        amountPaid: parseFloat(formData.amountPaid),
      });
      toast.success('Milk collection added successfully');
      setShowAddModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add collection');
    }
  };

  const resetForm = () => {
    setFormData({
      farmerName: '',
      farmerId: '',
      liters: 0,
      fatPercent: 0,
      pricePerLiter: 0,
      amountPaid: 0,
      notes: '',
    });
  };

  const calculateSummary = () => {
    const today = new Date().toDateString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const todayCollections = collections.filter(c => 
      new Date(c.date).toDateString() === today
    );
    const weekCollections = collections.filter(c => 
      new Date(c.date) >= weekAgo
    );
    const monthCollections = collections.filter(c => 
      new Date(c.date) >= monthAgo
    );

    return {
      today: {
        liters: todayCollections.reduce((sum, c) => sum + c.liters, 0),
        amount: todayCollections.reduce((sum, c) => sum + (c.liters * c.pricePerLiter), 0),
      },
      week: {
        liters: weekCollections.reduce((sum, c) => sum + c.liters, 0),
        amount: weekCollections.reduce((sum, c) => sum + (c.liters * c.pricePerLiter), 0),
      },
      month: {
        liters: monthCollections.reduce((sum, c) => sum + c.liters, 0),
        amount: monthCollections.reduce((sum, c) => sum + (c.liters * c.pricePerLiter), 0),
      },
    };
  };

  const chartData = stats.map(stat => ({
    date: new Date(stat._id.y, stat._id.m - 1, stat._id.d).toLocaleDateString(),
    liters: stat.liters,
    amount: stat.amount,
  }));

  const collectionColumns = [
    { key: 'date', label: 'Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'farmerName', label: 'Farmer Name' },
    { key: 'farmerId', label: 'Farmer ID', render: (value) => value || '-' },
    { key: 'liters', label: 'Liters', render: (value) => `${value}L` },
    { key: 'fatPercent', label: 'Fat %', render: (value) => `${value}%` },
    { key: 'pricePerLiter', label: 'Price/L', render: (value) => `$${value?.toFixed(2) || '0.00'}` },
    { key: 'amountPaid', label: 'Amount Paid', render: (value) => `$${value?.toFixed(2) || '0.00'}` },
    { key: 'notes', label: 'Notes', render: (value) => value || '-' },
  ];

  const summary = calculateSummary();

  if (loading) {
    return <div className="card">Loading milk collections...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Milk Collections</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          Add Collection
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Today's Collection"
          value={`${summary.today.liters.toFixed(1)}L`}
          delta={`$${summary.today.amount.toFixed(2)}`}
        />
        <StatCard
          title="This Week"
          value={`${summary.week.liters.toFixed(1)}L`}
          delta={`$${summary.week.amount.toFixed(2)}`}
        />
        <StatCard
          title="This Month"
          value={`${summary.month.liters.toFixed(1)}L`}
          delta={`$${summary.month.amount.toFixed(2)}`}
        />
      </div>

      {/* Chart */}
      <ChartCard title="Daily Milk Collection (Last 30 Days)">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="liters" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Collections Table */}
      <Table
        data={collections}
        columns={collectionColumns}
        searchable
        searchFields={['farmerName', 'farmerId', 'notes']}
        pagination
        itemsPerPage={10}
      />

      {/* Add Collection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Milk Collection</h2>
            <form onSubmit={handleAddCollection} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farmer Name</label>
                <input
                  type="text"
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farmer ID (Optional)</label>
                <input
                  type="text"
                  value={formData.farmerId}
                  onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Liters</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.liters}
                  onChange={(e) => setFormData({ ...formData, liters: parseFloat(e.target.value) || 0 })}
                  className="input"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fat Percentage</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fatPercent}
                  onChange={(e) => setFormData({ ...formData, fatPercent: parseFloat(e.target.value) || 0 })}
                  className="input"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Liter</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pricePerLiter}
                  onChange={(e) => setFormData({ ...formData, pricePerLiter: parseFloat(e.target.value) || 0 })}
                  className="input"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({ ...formData, amountPaid: parseFloat(e.target.value) || 0 })}
                  className="input"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Optional notes..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Add Collection
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
