const API_BASE_URL = '/api';

export const apiClient = {
  // Employee endpoints
  getEmployee: async (employeeId: string) => {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`);
    if (!response.ok) throw new Error('Failed to fetch employee');
    return response.json();
  },

  // Attendance endpoints
  getAttendance: async (employeeId: string) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${employeeId}`);
    if (!response.ok) throw new Error('Failed to fetch attendance');
    return response.json();
  },

  addAttendance: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add attendance');
    return response.json();
  },

  updateAttendance: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update attendance');
    return response.json();
  },

  deleteAttendance: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete attendance');
    return response.json();
  },

  // Leave endpoints
  getLeaves: async (employeeId: string) => {
    const response = await fetch(`${API_BASE_URL}/leaves/${employeeId}`);
    if (!response.ok) throw new Error('Failed to fetch leaves');
    return response.json();
  },

  addLeave: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add leave');
    return response.json();
  },

  updateLeave: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/leaves/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update leave');
    return response.json();
  },

  // Salary slip endpoint
  getSalarySlip: async (employeeId: string, month: number) => {
    const response = await fetch(`${API_BASE_URL}/salary-slip/${employeeId}?month=${month}`);
    if (!response.ok) throw new Error('Failed to fetch salary slip');
    return response.json();
  },

  // Generate salary slip PDF
  generateSalarySlipPDF: async (employeeId: string, month: number) => {
    const response = await fetch(`${API_BASE_URL}/salary-slip/${employeeId}/pdf?month=${month}`);
    if (!response.ok) throw new Error('Failed to generate salary slip PDF');
    return response.blob();
  },
};