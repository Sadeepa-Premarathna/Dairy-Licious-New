export interface Employee {
  id: string;
  name: string;
  basicSalary: number;
  otAmount: number;
  allowances: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  epfEmployee: number;
  epfEmployer: number;
  etfEmployer: number;
}

export interface EmployeeAllowance {
  id: string;
  employeeId: string;
  employeeName: string;
  allowanceType: 'Food' | 'Travel' | 'Bonus';
  amount: number;
  month: string;
}

export interface PayrollSummary {
  totalGrossSalary: number;
  totalEpfEmployee: number;
  totalEpfEtfEmployer: number;
  totalNetSalary: number;
}

export interface PayrollCardData {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}