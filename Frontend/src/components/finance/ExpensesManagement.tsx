import React, { useState, useEffect } from 'react';
import { ExpenseItem, ExpenseSummary } from '../types/expense';
import { Link } from 'react-router-dom';
import './ExpensesManagement.css';

const ExpensesManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('thisMonth');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      // Mock data for expenses calculation
      const mockExpenses: ExpenseItem[] = [
        {
          _id: '1',
          category: 'transportation',
          description: 'Fuel cost for milk collection truck',
          amount: 2500,
          date: '2025-09-15',
          collectionPoint: 'Village Center - Pune',
          driverId: 'DRV001',
          quantity: 150,
          unitCost: 16.67,
          status: 'approved',
          notes: 'Daily collection route fuel',
          createdAt: '2025-09-15T06:00:00Z'
        },
        {
          _id: '2',
          category: 'labor',
          description: 'Milk collection staff wages',
          amount: 1200,
          date: '2025-09-15',
          collectionPoint: 'Main Road - Mumbai',
          quantity: 200,
          unitCost: 6.00,
          status: 'approved',
          isRecurring: true,
          frequency: 'daily',
          notes: 'Daily wages for collection staff',
          createdAt: '2025-09-15T08:00:00Z'
        },
        {
          _id: '3',
          category: 'equipment',
          description: 'Milk testing equipment maintenance',
          amount: 800,
          date: '2025-09-14',
          status: 'pending',
          notes: 'Monthly maintenance of quality testing equipment',
          createdAt: '2025-09-14T10:00:00Z'
        },
        {
          _id: '4',
          category: 'storage',
          description: 'Cold storage electricity',
          amount: 1500,
          date: '2025-09-14',
          quantity: 500,
          unitCost: 3.00,
          status: 'approved',
          isRecurring: true,
          frequency: 'monthly',
          notes: 'Monthly electricity for cold storage units',
          createdAt: '2025-09-14T12:00:00Z'
        },
        {
          _id: '5',
          category: 'packaging',
          description: 'Milk containers and packaging',
          amount: 950,
          date: '2025-09-13',
          quantity: 300,
          unitCost: 3.17,
          status: 'approved',
          notes: 'Weekly packaging material purchase',
          createdAt: '2025-09-13T14:00:00Z'
        },
        {
          _id: '6',
          category: 'testing',
          description: 'Quality testing chemicals',
          amount: 600,
          date: '2025-09-12',
          status: 'approved',
          notes: 'Monthly purchase of testing chemicals',
          createdAt: '2025-09-12T09:00:00Z'
        }
      ];

      const mockSummary: ExpenseSummary = {
        totalExpenses: 7550,
        totalMilkQuantity: 1150,
        costPerLiter: 6.56,
        revenue: 57500, // Assuming ₹50 per liter average
        profit: 49950,
        profitMargin: 86.87,
        categoryBreakdown: [
          { category: 'Transportation', totalAmount: 2500, itemCount: 1, percentage: 33.11 },
          { category: 'Storage', totalAmount: 1500, itemCount: 1, percentage: 19.87 },
          { category: 'Labor', totalAmount: 1200, itemCount: 1, percentage: 15.89 },
          { category: 'Packaging', totalAmount: 950, itemCount: 1, percentage: 12.58 },
          { category: 'Equipment', totalAmount: 800, itemCount: 1, percentage: 10.60 },
          { category: 'Testing', totalAmount: 600, itemCount: 1, percentage: 7.95 }
        ],
        monthlyTrend: [
          { month: 'Jun 2025', totalExpenses: 6800, totalRevenue: 52000, profit: 45200, milkQuantity: 1040 },
          { month: 'Jul 2025', totalExpenses: 7200, totalRevenue: 54500, profit: 47300, milkQuantity: 1090 },
          { month: 'Aug 2025', totalExpenses: 7400, totalRevenue: 56000, profit: 48600, milkQuantity: 1120 },
          { month: 'Sep 2025', totalExpenses: 7550, totalRevenue: 57500, profit: 49950, milkQuantity: 1150 }
        ]
      };

      setExpenses(mockExpenses);
      setSummary(mockSummary);
    } catch (err) {
      setError('Failed to fetch expenses data');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pending', icon: '⏳' },
      approved: { class: 'status-approved', text: 'Approved', icon: '✅' },
      rejected: { class: 'status-rejected', text: 'Rejected', icon: '❌' },
      paid: { class: 'status-paid', text: 'Paid', icon: '💰' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.icon} {config.text}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      transportation: '🚛',
      fuel: '⛽',
      maintenance: '🔧',
      labor: '👷',
      equipment: '⚙️',
      storage: '🏪',
      utilities: '💡',
      packaging: '📦',
      testing: '🧪',
      miscellaneous: '📋'
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading expenses data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <div className="header-info">
          <h2>💰 Expenses Management</h2>
          <p>Calculate and track milk collection expenses</p>
        </div>
        <Link to="/expenses/create" className="btn btn-primary">
          ➕ Add Expense
        </Link>
      </div>

      {summary && (
        <div className="expenses-summary">
          <div className="summary-cards">
            <div className="summary-card highlight">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h3>{formatCurrency(summary.totalExpenses)}</h3>
                <p>Total Expenses</p>
                <span className="card-detail">
                  {formatCurrency(summary.costPerLiter)}/L
                </span>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">🥛</div>
              <div className="card-content">
                <h3>{summary.totalMilkQuantity.toLocaleString()}L</h3>
                <p>Milk Quantity</p>
                <span className="card-detail">This month</span>
              </div>
            </div>
            <div className="summary-card success">
              <div className="card-icon">📈</div>
              <div className="card-content">
                <h3>{formatCurrency(summary.revenue)}</h3>
                <p>Total Revenue</p>
                <span className="card-detail">
                  {summary.profitMargin.toFixed(1)}% margin
                </span>
              </div>
            </div>
            <div className="summary-card profit">
              <div className="card-icon">💵</div>
              <div className="card-content">
                <h3>{formatCurrency(summary.profit)}</h3>
                <p>Net Profit</p>
                <span className="card-detail">After expenses</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="expenses-analytics">
        <div className="analytics-row">
          <div className="category-breakdown">
            <h3>📊 Expense Categories</h3>
            <div className="category-chart">
              {summary?.categoryBreakdown.map((cat, index) => (
                <div key={index} className="category-item">
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                  <div className="category-info">
                    <span className="category-name">{cat.category}</span>
                    <span className="category-amount">{formatCurrency(cat.totalAmount)}</span>
                    <span className="category-percentage">{cat.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="cost-analysis">
            <h3>📈 Cost Analysis</h3>
            <div className="analysis-metrics">
              <div className="metric">
                <span className="metric-label">Cost per Liter</span>
                <span className="metric-value">{formatCurrency(summary?.costPerLiter || 0)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Revenue per Liter</span>
                <span className="metric-value">₹50.00</span>
              </div>
              <div className="metric">
                <span className="metric-label">Profit per Liter</span>
                <span className="metric-value profit-metric">
                  {formatCurrency((summary?.revenue || 0) / (summary?.totalMilkQuantity || 1) - (summary?.costPerLiter || 0))}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Break-even Point</span>
                <span className="metric-value">{formatCurrency(summary?.costPerLiter || 0)}/L</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="expenses-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="🔍 Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="transportation">Transportation</option>
            <option value="labor">Labor</option>
            <option value="equipment">Equipment</option>
            <option value="storage">Storage</option>
            <option value="packaging">Packaging</option>
            <option value="testing">Testing</option>
            <option value="utilities">Utilities</option>
            <option value="miscellaneous">Miscellaneous</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="paid">Paid</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
      </div>

      <div className="expenses-table-container">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Unit Cost</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Status</th>
              <th>Collection Point</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense._id} className="table-row">
                <td>
                  <div className="category-cell">
                    <span className="category-icon">{getCategoryIcon(expense.category)}</span>
                    <span className="category-text">
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="description-cell">
                    <strong>{expense.description}</strong>
                    {expense.notes && <p className="expense-notes">{expense.notes}</p>}
                  </div>
                </td>
                <td>
                  <span className="amount">{formatCurrency(expense.amount)}</span>
                </td>
                <td>
                  <span className="unit-cost">
                    {expense.unitCost ? formatCurrency(expense.unitCost) + '/L' : 'N/A'}
                  </span>
                </td>
                <td>
                  <span className="quantity">
                    {expense.quantity ? expense.quantity + 'L' : 'N/A'}
                  </span>
                </td>
                <td>
                  <span className="date">{formatDate(expense.date)}</span>
                </td>
                <td>
                  {getStatusBadge(expense.status)}
                </td>
                <td>
                  <span className="collection-point">
                    {expense.collectionPoint || 'General'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/expenses/${expense._id}`} className="btn btn-secondary btn-sm">
                      👁️
                    </Link>
                    <Link to={`/expenses/edit/${expense._id}`} className="btn btn-primary btn-sm">
                      ✏️
                    </Link>
                    <button className="btn btn-success btn-sm">
                      ✅
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExpenses.length === 0 && (
        <div className="no-results">
          <h3>No expenses found</h3>
          <p>Try adjusting your search criteria or add a new expense.</p>
        </div>
      )}
    </div>
  );
};

export default ExpensesManagement;
