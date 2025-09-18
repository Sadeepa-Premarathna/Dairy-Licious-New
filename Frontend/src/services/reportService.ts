import { ReportFilters, PayrollReportData, PerformanceReportData } from '../types/reports';
import { getEmployeeData, calculatePayrollSummary } from '../data/payrollData';
import { calculateTotals } from '../data/revenueExpenseData';
import { getMonthlyData } from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reportService = {
  async generatePayrollReport(filters: ReportFilters): Promise<PayrollReportData> {
    await delay(1000);
    
    const employees = getEmployeeData();
    const summary = calculatePayrollSummary(employees);
    
    // Simulate different data based on time period
    const multiplier = filters.timePeriod === 'Weekly' ? 0.25 : 
                     filters.timePeriod === 'Monthly' ? 1 : 12;
    
    return {
      totalGrossSalary: summary.totalGrossSalary * multiplier,
      totalEpfEmployee: summary.totalEpfEmployee * multiplier,
      totalEpfEmployer: summary.totalEpfEtfEmployer * 0.75 * multiplier, // EPF portion
      totalEtfEmployer: summary.totalEpfEtfEmployer * 0.25 * multiplier, // ETF portion
      totalNetSalary: summary.totalNetSalary * multiplier,
      totalEmployees: employees.length,
      periodLabel: getPeriodLabel(filters.timePeriod),
      previousPeriodComparison: {
        grossSalaryChange: Math.random() * 10 - 5, // Random change between -5% and +5%
        netSalaryChange: Math.random() * 8 - 4
      }
    };
  },

  async generatePerformanceReport(filters: ReportFilters): Promise<PerformanceReportData> {
    await delay(1000);
    
    const totals = calculateTotals();
    const monthlyData = getMonthlyData();
    
    // Simulate different data based on time period
    const multiplier = filters.timePeriod === 'Weekly' ? 0.25 : 
                     filters.timePeriod === 'Monthly' ? 1 : 12;
    
    const revenue = totals.totalRevenue * multiplier;
    const expenses = totals.totalExpenses * multiplier;
    const profit = revenue - expenses;
    
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      totalProfit: profit,
      profitMargin: (profit / revenue) * 100,
      periodLabel: getPeriodLabel(filters.timePeriod),
      expenseBreakdown: {
        salaries: totals.totalSalaries * multiplier,
        milkPurchases: totals.totalMilkPurchases * multiplier,
        additionalExpenses: totals.totalAdditionalExpenses * multiplier
      },
      previousPeriodComparison: {
        revenueChange: Math.random() * 15 - 7.5,
        expensesChange: Math.random() * 10 - 5,
        profitChange: Math.random() * 20 - 10
      },
      monthlyData: filters.timePeriod === 'Yearly' ? monthlyData.slice(0, 8).map(item => ({
        period: item.month,
        revenue: item.revenue,
        expenses: item.expenses,
        profit: item.revenue - item.expenses
      })) : undefined
    };
  }
};

function getPeriodLabel(timePeriod: string): string {
  const now = new Date();
  
  switch (timePeriod) {
    case 'Weekly':
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(now.setDate(weekStart.getDate() + 6));
      return `Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    
    case 'Monthly':
      return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    case 'Yearly':
      return now.getFullYear().toString();
    
    default:
      return 'Current Period';
  }
}