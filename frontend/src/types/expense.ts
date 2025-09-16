export interface ExpenseItem {
  _id?: string;
  category: 'transportation' | 'fuel' | 'maintenance' | 'labor' | 'equipment' | 'storage' | 'utilities' | 'packaging' | 'testing' | 'miscellaneous';
  description: string;
  amount: number;
  date: string;
  collectionPoint?: string;
  driverId?: string;
  farmerId?: string;
  quantity?: number; // liters of milk associated with this expense
  unitCost?: number; // cost per liter
  receipt?: string;
  isRecurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseCategory {
  category: string;
  totalAmount: number;
  itemCount: number;
  percentage: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  totalMilkQuantity: number;
  costPerLiter: number;
  categoryBreakdown: ExpenseCategory[];
  monthlyTrend: MonthlyExpense[];
  profitMargin: number;
  revenue: number;
  profit: number;
}

export interface MonthlyExpense {
  month: string;
  totalExpenses: number;
  totalRevenue: number;
  profit: number;
  milkQuantity: number;
}

export interface ExpenseResponse {
  expenses: ExpenseItem[];
  summary: ExpenseSummary;
  totalPages: number;
  currentPage: number;
  total: number;
}
