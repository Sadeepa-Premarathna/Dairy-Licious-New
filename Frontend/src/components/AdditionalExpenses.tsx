import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Filter, DollarSign, Calendar, Tag, FileText, Truck, Monitor, Shield } from 'lucide-react';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, ExpenseFilters } from '../types/expense';
import { expenseService } from '../services/expenseService';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Modal from './ui/Modal';
import AlertDialog from './ui/AlertDialog';
import Toast from './ui/Toast';

const AdditionalExpenses: React.FC = () => {
  // State management
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({ search: '', category: '' });
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Form state
  const [formData, setFormData] = useState<CreateExpenseRequest>({
    category: '',
    description: '',
    date: '',
    amount: 0
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Category options - dynamically generated from database data
  const categoryOptions = useMemo(() => {
    // Get unique categories from expenses data
    const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];
    
    // Create options array with "All Categories" first, then all unique categories
    const options = [
      { value: '', label: 'All Categories' },
      ...uniqueCategories.map(category => ({
        value: category,
        label: category
      }))
    ];
    
    return options;
  }, [expenses]);

  // Load expenses on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (error) {
      showToast('Failed to load expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                           expense.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || expense.category === filters.category;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue = sortField === 'date' ? new Date(a.date).getTime() : a.amount;
      let bValue = sortField === 'date' ? new Date(b.date).getTime() : b.amount;
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [expenses, filters, sortField, sortDirection]);

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredAndSortedExpenses]);

  // Form validation
  const validateForm = (data: CreateExpenseRequest): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.category) errors.category = 'Category is required';
    if (!data.description.trim()) errors.description = 'Description is required';
    if (!data.date) errors.date = 'Date is required';
    if (!data.amount || data.amount <= 0) errors.amount = 'Amount must be greater than 0';
    
    return errors;
  };

  // Toast helper
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  // Form handlers
  const handleInputChange = (field: keyof CreateExpenseRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      date: '',
      amount: 0
    });
    setFormErrors({});
  };

  // CRUD operations
  const handleCreate = async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await expenseService.createExpense(formData);
      await loadExpenses();
      setIsCreateModalOpen(false);
      resetForm();
      showToast('Expense created successfully', 'success');
    } catch (error) {
      showToast('Failed to create expense', 'error');
    }
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormData({
      category: expense.category,
      description: expense.description,
      date: expense.date,
      amount: expense.amount
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedExpense) return;
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await expenseService.updateExpense({
        id: selectedExpense.id,
        ...formData
      });
      await loadExpenses();
      setIsEditModalOpen(false);
      setSelectedExpense(null);
      resetForm();
      showToast('Expense updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update expense', 'error');
    }
  };

  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedExpense) return;

    try {
      await expenseService.deleteExpense(selectedExpense.id);
      await loadExpenses();
      setIsDeleteDialogOpen(false);
      setSelectedExpense(null);
      showToast('Expense deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete expense', 'error');
    }
  };

  // Sorting handlers
  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'machine purchase':
        return <Tag className="w-4 h-4 text-blue-600" />;
      case 'maintenance':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'utilities':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'logistics':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'software':
        return <Monitor className="w-4 h-4 text-indigo-600" />;
      case 'health & safety':
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'machine purchase':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'utilities':
        return 'bg-green-100 text-green-800';
      case 'logistics':
        return 'bg-purple-100 text-purple-800';
      case 'software':
        return 'bg-indigo-100 text-indigo-800';
      case 'health & safety':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Additional Expenses Management
            </h1>
            <p className="text-gray-600">
              Manage factory operational expenses and track spending across categories
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search expenses..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select
              options={categoryOptions}
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            />
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredAndSortedExpenses.length} of {expenses.length} expenses
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <span className="text-gray-400">
                      {sortField === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Amount</span>
                    <span className="text-gray-400">
                      {sortField === 'amount' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                    </span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Loading expenses...
                  </td>
                </tr>
              ) : filteredAndSortedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No expenses found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredAndSortedExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(expense.category)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                          {expense.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {expense.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(expense)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        {filteredAndSortedExpenses.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Total Expenses ({filteredAndSortedExpenses.length} items)
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(totalExpenses)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Add New Expense"
      >
        <div className="space-y-4">
          <Select
            label="Category"
            options={categoryOptions.slice(1)} // Remove "All Categories" option
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            error={formErrors.category}
          />
          <Input
            label="Description"
            placeholder="Enter expense description..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={formErrors.description}
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={formErrors.date}
          />
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            error={formErrors.amount}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Expense
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
          resetForm();
        }}
        title="Edit Expense"
      >
        <div className="space-y-4">
          <Select
            label="Category"
            options={categoryOptions.slice(1)}
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            error={formErrors.category}
          />
          <Input
            label="Description"
            placeholder="Enter expense description..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={formErrors.description}
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            error={formErrors.date}
          />
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            error={formErrors.amount}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedExpense(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update Expense
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedExpense(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Expense"
        description={`Are you sure you want to delete this expense? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default AdditionalExpenses;