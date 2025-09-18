import { FinancialData, MonthlyData, ExpenseBreakdown, Transaction } from '../types';

// Simulating data that would come from other components in the system
export const getFinancialOverview = (): FinancialData => {
  // This would normally come from various components:
  // - Total Revenue from Inventory Manager
  // - Expenses from HR, Collection, and Finance components
  return {
    totalRevenue: 287500.00,
    totalExpenses: 198750.50,
    profit: 88749.50
  };
};

export const getMonthlyData = (): MonthlyData[] => {
  // This would come from monthly data stored by various components
  return [
    { month: 'Jan', revenue: 245000, expenses: 180000 },
    { month: 'Feb', revenue: 267000, expenses: 195000 },
    { month: 'Mar', revenue: 289000, expenses: 201000 },
    { month: 'Apr', revenue: 301000, expenses: 215000 },
    { month: 'May', revenue: 278000, expenses: 198000 },
    { month: 'Jun', revenue: 312000, expenses: 225000 },
    { month: 'Jul', revenue: 295000, expenses: 208000 },
    { month: 'Aug', revenue: 287500, expenses: 198750 },
    { month: 'Sep', revenue: 0, expenses: 0 },
    { month: 'Oct', revenue: 0, expenses: 0 },
    { month: 'Nov', revenue: 0, expenses: 0 },
    { month: 'Dec', revenue: 0, expenses: 0 }
  ];
};

export const getCurrentMonthExpenses = (): ExpenseBreakdown => {
  // This would come from:
  // - HR Manager component (salaries)
  // - Collection & Distribution Manager (milk purchase)
  // - Finance Manager additional expenses form
  return {
    milkPurchase: 125000.00,
    salaries: 45750.50,
    additionalExpenses: 28000.00
  };
};

export const getRecentTransactions = (): Transaction[] => {
  // This would come from the Inventory Manager/Sales system
  return [
    {
      id: '1',
      company: 'SuperMart Ltd.',
      client: 'John Anderson',
      amount: 15750.00,
      date: '2025-01-15'
    },
    {
      id: '2',
      company: 'FreshMilk Co.',
      client: 'Sarah Mitchell',
      amount: 28900.00,
      date: '2025-01-14'
    },
    {
      id: '3',
      company: 'Dairy Delights Inc.',
      client: 'Michael Chen',
      amount: 12300.00,
      date: '2025-01-13'
    },
    {
      id: '4',
      company: 'Pure Valley Foods',
      client: 'Emma Thompson',
      amount: 31200.00,
      date: '2025-01-12'
    },
    {
      id: '5',
      company: 'Golden Dairy Ltd.',
      client: 'Robert Wilson',
      amount: 22450.00,
      date: '2025-01-11'
    }
  ];
};