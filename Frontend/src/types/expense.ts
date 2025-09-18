export interface Expense {
  id: string;
  category: 'Machine Purchase' | 'Maintenance' | 'Utilities' | 'Other';
  description: string;
  date: string;
  amount: number;
  approved_by?: string | null;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  category: string;
  description: string;
  date: string;
  amount: number;
  approved_by?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface UpdateExpenseRequest extends CreateExpenseRequest {
  id: string;
}

export interface ExpenseFilters {
  search: string;
  category: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  categoryBreakdown: Record<string, number>;
}