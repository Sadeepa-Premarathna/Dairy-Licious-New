export interface RevenueExpenseCard {
  id: string;
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

export interface RevenueRecord {
  id: string;
  date: string;
  orderId: string;
  productCategory: string;
  customerName: string;
  amount: number;
  status: string;
}

export interface SalaryRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  basicSalary: number;
  otAmount: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payDate: string;
}

export interface MilkPurchaseRecord {
  id: string;
  supplierName: string;
  date: string;
  quantity: number;
  pricePerLiter: number;
  totalAmount: number;
  qualityGrade: string;
}

export interface AdditionalExpenseRecord {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
  status: string;
}

export type ViewType = 'overview' | 'expense-categories' | 'revenue-details' | 'salary-details' | 'milk-details' | 'additional-details';

export interface BreadcrumbItem {
  label: string;
  view: ViewType;
}