import { Expense, CreateExpenseRequest, UpdateExpenseRequest } from '../types/expense';

// API base URL - adjust this based on your backend URL
const API_BASE_URL = 'http://localhost:8000/api';

// Backend response interface
interface BackendExpense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  approved_by: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to map backend data to frontend format
const mapBackendToFrontend = (backendExpense: BackendExpense): Expense => {
  return {
    id: backendExpense.id,
    category: backendExpense.category as Expense['category'],
    description: backendExpense.description,
    date: backendExpense.date.split('T')[0], // Convert ISO date to YYYY-MM-DD format
    amount: backendExpense.amount,
    approved_by: backendExpense.approved_by,
    status: backendExpense.status as Expense['status'],
    createdAt: backendExpense.createdAt,
    updatedAt: backendExpense.updatedAt
  };
};

// Helper function to map frontend data to backend format
const mapFrontendToBackend = (frontendExpense: CreateExpenseRequest | UpdateExpenseRequest) => {
  const backendData: any = {
    category: frontendExpense.category,
    description: frontendExpense.description,
    date: frontendExpense.date,
    amount: frontendExpense.amount
  };

  // Add approved_by and status if they exist
  if ('approved_by' in frontendExpense && frontendExpense.approved_by !== undefined) {
    backendData.approved_by = frontendExpense.approved_by;
  }
  if ('status' in frontendExpense && frontendExpense.status !== undefined) {
    backendData.status = frontendExpense.status;
  }

  return backendData;
};

export const expenseService = {
  // Get all expenses
  async getExpenses(): Promise<Expense[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/additional-expenses`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const backendExpenses: BackendExpense[] = await response.json();
      return backendExpenses.map(mapBackendToFrontend);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw new Error('Failed to fetch expenses');
    }
  },

  // Create new expense
  async createExpense(expense: CreateExpenseRequest): Promise<Expense> {
    try {
      const backendData = mapFrontendToBackend(expense);
      
      const response = await fetch(`${API_BASE_URL}/additional-expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const backendExpense: BackendExpense = await response.json();
      return mapBackendToFrontend(backendExpense);
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // Update expense
  async updateExpense(expense: UpdateExpenseRequest): Promise<Expense> {
    try {
      const backendData = mapFrontendToBackend(expense);
      
      const response = await fetch(`${API_BASE_URL}/additional-expenses/${expense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const backendExpense: BackendExpense = await response.json();
      return mapBackendToFrontend(backendExpense);
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // Delete expense
  async deleteExpense(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/additional-expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
};