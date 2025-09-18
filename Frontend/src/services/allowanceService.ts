import { Allowance, AllowanceFormData, AllowanceFilters } from '../types/allowance';

const API_BASE_URL = 'http://localhost:8000/api/allowances';

export const allowanceService = {
  // Get all allowances with optional filters
  async getAllAllowances(filters?: AllowanceFilters): Promise<Allowance[]> {
    const params = new URLSearchParams();
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.month) params.append('month', filters.month);

    const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch allowances');
    }
    return response.json();
  },

  // Create a new allowance
  async createAllowance(data: AllowanceFormData): Promise<Allowance> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create allowance');
    }
    return response.json();
  },

  // Update an existing allowance
  async updateAllowance(id: string, data: Partial<AllowanceFormData>): Promise<Allowance> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update allowance');
    }
    return response.json();
  },

  // Delete an allowance
  async deleteAllowance(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete allowance');
    }
  },
};
