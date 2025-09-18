export interface Allowance {
  id: string;
  employeeId: string;
  employeeName: string;
  allowanceType: 'Food' | 'Travel' | 'Bonus';
  amount: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllowanceFormData {
  employeeId: string;
  employeeName: string;
  allowanceType: 'Food' | 'Travel' | 'Bonus';
  amount: number;
  month: string;
}

export interface AllowanceFilters {
  employeeId?: string;
  month?: string;
}
