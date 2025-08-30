import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { Allowance, AllowanceFormData, AllowanceFilters } from '../types/allowance';
import { allowanceService } from '../services/allowanceService';
import { getEmployeeData } from '../data/payrollData';

const AllowanceManager: React.FC = () => {
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState<Allowance | null>(null);
  const [filters, setFilters] = useState<AllowanceFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [employees] = useState(() => getEmployeeData());

  const [formData, setFormData] = useState<AllowanceFormData>({
    employeeId: '',
    employeeName: '',
    allowanceType: 'Food',
    amount: 0,
    month: new Date().toISOString().slice(0, 7) // YYYY-MM format
  });

  const allowanceTypes = [
    { value: 'Food', label: 'Food Allowance' },
    { value: 'Travel', label: 'Travel Allowance' },
    { value: 'Bonus', label: 'Bonus' }
  ];

  const months = [
    { value: '2024-01', label: 'January 2024' },
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-03', label: 'March 2024' },
    { value: '2024-04', label: 'April 2024' },
    { value: '2024-05', label: 'May 2024' },
    { value: '2024-06', label: 'June 2024' },
    { value: '2024-07', label: 'July 2024' },
    { value: '2024-08', label: 'August 2024' },
    { value: '2024-09', label: 'September 2024' },
    { value: '2024-10', label: 'October 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-12', label: 'December 2024' }
  ];

  // Fetch allowances
  const fetchAllowances = async () => {
    try {
      setLoading(true);
      const data = await allowanceService.getAllAllowances(filters);
      setAllowances(data);
    } catch (error) {
      console.error('Error fetching allowances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowances();
  }, [filters]);

  // Handle employee selection
  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    setFormData(prev => ({
      ...prev,
      employeeId,
      employeeName: employee?.name || ''
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAllowance) {
        await allowanceService.updateAllowance(editingAllowance.id, formData);
      } else {
        await allowanceService.createAllowance(formData);
      }
      setIsModalOpen(false);
      setEditingAllowance(null);
      resetForm();
      fetchAllowances();
    } catch (error) {
      console.error('Error saving allowance:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Handle edit
  const handleEdit = (allowance: Allowance) => {
    setEditingAllowance(allowance);
    setFormData({
      employeeId: allowance.employeeId,
      employeeName: allowance.employeeName,
      allowanceType: allowance.allowanceType,
      amount: allowance.amount,
      month: allowance.month
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this allowance?')) {
      try {
        await allowanceService.deleteAllowance(id);
        fetchAllowances();
      } catch (error) {
        console.error('Error deleting allowance:', error);
        alert(error instanceof Error ? error.message : 'An error occurred');
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      allowanceType: 'Food',
      amount: 0,
      month: new Date().toISOString().slice(0, 7)
    });
  };

  // Open modal for new allowance
  const openNewModal = () => {
    setEditingAllowance(null);
    resetForm();
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAllowance(null);
    resetForm();
  };

  // Filter allowances based on search term
  const filteredAllowances = allowances.filter(allowance =>
    allowance.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allowance.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allowance.allowanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allowance.month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total allowances
  const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Allowance Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage employee allowances and benefits
          </p>
        </div>
        <Button onClick={openNewModal} className="flex items-center gap-2">
          <Plus size={16} />
          Add Allowance
        </Button>
      </div>

      {/* Summary Card */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Total Allowances</p>
            <p className="text-2xl font-bold text-blue-900">
              {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(totalAllowances)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600">This Month</p>
            <p className="text-lg font-semibold text-blue-900">
              {allowances.length} Records
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Search by employee ID, name, type, or month..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={filters.employeeId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, employeeId: e.target.value || undefined }))}
            className="min-w-[150px]"
            options={[
              { value: '', label: 'All Employees' },
              ...employees.map(emp => ({ value: emp.id, label: emp.name }))
            ]}
          />
          <Select
            value={filters.month || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value || undefined }))}
            className="min-w-[150px]"
            options={[
              { value: '', label: 'All Months' },
              ...months.map(month => ({ value: month.value, label: month.label }))
            ]}
          />
        </div>
      </div>

      {/* Allowances Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Employee ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Month</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Loading allowances...
                </td>
              </tr>
            ) : filteredAllowances.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No allowances found
                </td>
              </tr>
            ) : (
              filteredAllowances.map((allowance) => (
                <tr key={allowance.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {allowance.employeeId}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {allowance.employeeName}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      allowance.allowanceType === 'Food' ? 'bg-green-100 text-green-800' :
                      allowance.allowanceType === 'Travel' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {allowance.allowanceType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(allowance.amount)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(allowance.month + '-01').toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(allowance)}
                        className="p-1"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(allowance.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAllowance ? 'Edit Allowance' : 'Add New Allowance'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
                             <Select
                 value={formData.employeeId}
                 onChange={(e) => handleEmployeeChange(e.target.value)}
                 required
                 options={[
                   { value: '', label: 'Select Employee' },
                   ...employees.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.id})` }))
                 ]}
               />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Name
              </label>
              <Input
                type="text"
                value={formData.employeeName}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                required
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allowance Type
              </label>
                             <Select
                 value={formData.allowanceType}
                 onChange={(e) => setFormData(prev => ({ 
                   ...prev, 
                   allowanceType: e.target.value as 'Food' | 'Travel' | 'Bonus' 
                 }))}
                 required
                 options={allowanceTypes}
               />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
                             <Select
                 value={formData.month}
                 onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                 required
                 options={months}
               />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAllowance ? 'Update Allowance' : 'Add Allowance'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllowanceManager;
