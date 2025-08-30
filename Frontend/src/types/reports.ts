export interface ReportFilters {
  timePeriod: 'Weekly' | 'Monthly' | 'Yearly';
  reportType: 'Payroll' | 'Performance';
}

export interface PayrollReportData {
  totalGrossSalary: number;
  totalEpfEmployee: number;
  totalEpfEmployer: number;
  totalEtfEmployer: number;
  totalNetSalary: number;
  totalEmployees: number;
  periodLabel: string;
  previousPeriodComparison?: {
    grossSalaryChange: number;
    netSalaryChange: number;
  };
}

export interface PerformanceReportData {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  profitMargin: number;
  periodLabel: string;
  expenseBreakdown: {
    salaries: number;
    milkPurchases: number;
    additionalExpenses: number;
  };
  previousPeriodComparison?: {
    revenueChange: number;
    expensesChange: number;
    profitChange: number;
  };
  monthlyData?: Array<{
    period: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

export interface ReportMetadata {
  companyName: string;
  reportTitle: string;
  timePeriod: string;
  generatedDate: string;
  generatedTime: string;
}