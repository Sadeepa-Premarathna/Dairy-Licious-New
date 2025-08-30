import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, TrendingDown, Users, Milk, Plus } from 'lucide-react';
import RevenueExpenseCard from './RevenueExpenseCard';
import ExpenseCategoryCard from './ExpenseCategoryCard';
import DataTable from './DataTable';
import { 
  ViewType, 
  BreadcrumbItem,
  RevenueRecord,
  SalaryRecord,
  MilkPurchaseRecord,
  AdditionalExpenseRecord
} from '../types/revenue';
import { 
  calculateTotals,
  getExpenseCategories,
  getRevenueData,
  getSalaryData,
  getMilkPurchaseData,
  getAdditionalExpenseData
} from '../data/revenueExpenseData';

const RevenueExpenseTracker: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { label: 'Revenue & Expenses', view: 'overview' }
  ]);
  const [totals, setTotals] = useState(calculateTotals());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch updated data
    const fetchData = async () => {
      setLoading(true);
      try {
        // In real app, this would be API calls to different modules
        const newTotals = calculateTotals();
        setTotals(newTotals);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateToView = (view: ViewType, label: string) => {
    setCurrentView(view);
    
    // Update breadcrumbs
    const newBreadcrumbs = [...breadcrumbs];
    const existingIndex = newBreadcrumbs.findIndex(b => b.view === view);
    
    if (existingIndex >= 0) {
      // Remove breadcrumbs after the existing one
      newBreadcrumbs.splice(existingIndex + 1);
    } else {
      // Add new breadcrumb
      newBreadcrumbs.push({ label, view });
    }
    
    setBreadcrumbs(newBreadcrumbs);
  };

  const navigateToBreadcrumb = (targetView: ViewType) => {
    const targetIndex = breadcrumbs.findIndex(b => b.view === targetView);
    if (targetIndex >= 0) {
      setCurrentView(targetView);
      setBreadcrumbs(breadcrumbs.slice(0, targetIndex + 1));
    }
  };

  const goBack = () => {
    if (breadcrumbs.length > 1) {
      const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2];
      navigateToBreadcrumb(previousBreadcrumb.view);
    }
  };

  const renderBreadcrumbs = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.view}>
          {index > 0 && <span className="text-gray-400">/</span>}
          <button
            onClick={() => navigateToBreadcrumb(breadcrumb.view)}
            className={`hover:text-blue-600 transition-colors ${
              index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-blue-600'
            }`}
          >
            {breadcrumb.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <RevenueExpenseCard
        title="Total Revenue"
        amount={totals.totalRevenue}
        icon={<DollarSign size={32} className="text-white" />}
        color="bg-yellow-500"
        bgColor="bg-yellow-50"
        description="Total revenue from all product sales and orders processed through the inventory management system"
        onClick={() => navigateToView('revenue-details', 'Revenue Details')}
      />
      <RevenueExpenseCard
        title="Total Expenses"
        amount={totals.totalExpenses}
        icon={<TrendingDown size={32} className="text-white" />}
        color="bg-blue-600"
        bgColor="bg-blue-50"
        description="Combined expenses including salaries, milk purchases, and additional operational costs"
        onClick={() => navigateToView('expense-categories', 'Expense Categories')}
      />
    </div>
  );

  const renderExpenseCategories = () => {
    const categories = getExpenseCategories();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <ExpenseCategoryCard
            key={category.id}
            id={category.id}
            name={category.name}
            amount={category.amount}
            icon={category.icon}
            color={category.color}
            bgColor={category.bgColor}
            description={category.description}
            onClick={() => {
              const viewMap: Record<string, ViewType> = {
                'salaries': 'salary-details',
                'milk-purchases': 'milk-details',
                'additional-expenses': 'additional-details'
              };
              navigateToView(viewMap[category.id], category.name);
            }}
          />
        ))}
      </div>
    );
  };

  const renderRevenueDetails = () => {
    const revenueData = getRevenueData();
    const columns = [
      { key: 'date', label: 'Date' },
      { key: 'orderId', label: 'Order ID' },
      { key: 'productCategory', label: 'Product Category' },
      { key: 'customerName', label: 'Customer Name' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status', render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )}
    ];

    return (
      <DataTable
        data={revenueData}
        columns={columns}
        title="Revenue Details"
        searchPlaceholder="Search by order ID, customer, or product..."
      />
    );
  };

  const renderSalaryDetails = () => {
    const salaryData = getSalaryData();
    const columns = [
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'employeeName', label: 'Employee Name' },
      { key: 'basicSalary', label: 'Basic Salary' },
      { key: 'otAmount', label: 'OT Amount' },
      { key: 'allowances', label: 'Allowances' },
      { key: 'deductions', label: 'Deductions' },
      { key: 'netSalary', label: 'Net Salary' },
      { key: 'payDate', label: 'Pay Date' }
    ];

    return (
      <DataTable
        data={salaryData}
        columns={columns}
        title="Salary Details"
        searchPlaceholder="Search by employee name or ID..."
      />
    );
  };

  const renderMilkDetails = () => {
    const milkData = getMilkPurchaseData();
    const columns = [
      { key: 'date', label: 'Date' },
      { key: 'supplierName', label: 'Supplier Name' },
      { key: 'quantity', label: 'Quantity (L)', render: (value: number) => `${value.toLocaleString()} L` },
      { key: 'pricePerLiter', label: 'Price/Liter' },
      { key: 'totalAmount', label: 'Total Amount' },
      { key: 'qualityGrade', label: 'Quality Grade', render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Grade A' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      )}
    ];

    return (
      <DataTable
        data={milkData}
        columns={columns}
        title="Milk Purchase Details"
        searchPlaceholder="Search by supplier name or quality grade..."
      />
    );
  };

  const renderAdditionalDetails = () => {
    const additionalData = getAdditionalExpenseData();
    const columns = [
      { key: 'date', label: 'Date' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'amount', label: 'Amount' },
      { key: 'approvedBy', label: 'Approved By' },
      { key: 'status', label: 'Status', render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )}
    ];

    return (
      <DataTable
        data={additionalData}
        columns={columns}
        title="Additional Expense Details"
        searchPlaceholder="Search by category or description..."
      />
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'expense-categories':
        return renderExpenseCategories();
      case 'revenue-details':
        return renderRevenueDetails();
      case 'salary-details':
        return renderSalaryDetails();
      case 'milk-details':
        return renderMilkDetails();
      case 'additional-details':
        return renderAdditionalDetails();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading revenue and expense data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Revenue & Expenses Tracking
            </h1>
            <p className="text-gray-600">
              Monitor financial performance with detailed drill-down capabilities
            </p>
          </div>
          
          {currentView !== 'overview' && (
            <button
              onClick={goBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
        </div>
        
        {renderBreadcrumbs()}
      </div>

      {/* Content */}
      <div className="transition-all duration-300">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default RevenueExpenseTracker;