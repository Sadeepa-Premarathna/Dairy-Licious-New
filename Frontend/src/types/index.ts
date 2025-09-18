export interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ExpenseBreakdown {
  milkPurchase: number;
  salaries: number;
  additionalExpenses: number;
}

export interface Transaction {
  id: string;
  company: string;
  client: string;
  amount: number;
  date: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  active?: boolean;
}

// Re-export allowance types
export * from './allowance';