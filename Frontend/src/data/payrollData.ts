import { Employee, PayrollSummary } from '../types/payroll';

// Mock employee data - in real app, this would come from HR system
export const getEmployeeData = (): Employee[] => {
  return [
    {
      id: 'EMP001',
      name: 'John Anderson',
      basicSalary: 75000,
      otAmount: 12500,
      allowances: 8000,
      deductions: 2500,
      grossSalary: 95500,
      netSalary: 85275,
      epfEmployee: 7162.50,
      epfEmployer: 9540,
      etfEmployer: 2865
    },
    {
      id: 'EMP002',
      name: 'Sarah Mitchell',
      basicSalary: 85000,
      otAmount: 15000,
      allowances: 10000,
      deductions: 3000,
      grossSalary: 110000,
      netSalary: 98100,
      epfEmployee: 8250,
      epfEmployer: 11000,
      etfEmployer: 3300
    },
    {
      id: 'EMP003',
      name: 'Michael Chen',
      basicSalary: 65000,
      otAmount: 8000,
      allowances: 6000,
      deductions: 1500,
      grossSalary: 79000,
      netSalary: 70815,
      epfEmployee: 5925,
      epfEmployer: 7900,
      etfEmployer: 2370
    },
    {
      id: 'EMP004',
      name: 'Emma Thompson',
      basicSalary: 95000,
      otAmount: 18000,
      allowances: 12000,
      deductions: 4000,
      grossSalary: 125000,
      netSalary: 111250,
      epfEmployee: 9375,
      epfEmployer: 12500,
      etfEmployer: 3750
    },
    {
      id: 'EMP005',
      name: 'Robert Wilson',
      basicSalary: 70000,
      otAmount: 10000,
      allowances: 7000,
      deductions: 2000,
      grossSalary: 87000,
      netSalary: 78030,
      epfEmployee: 6525,
      epfEmployer: 8700,
      etfEmployer: 2610
    },
    {
      id: 'EMP006',
      name: 'Lisa Garcia',
      basicSalary: 80000,
      otAmount: 14000,
      allowances: 9000,
      deductions: 2800,
      grossSalary: 103000,
      netSalary: 92070,
      epfEmployee: 7725,
      epfEmployer: 10300,
      etfEmployer: 3090
    },
    {
      id: 'EMP007',
      name: 'David Brown',
      basicSalary: 60000,
      otAmount: 7500,
      allowances: 5500,
      deductions: 1200,
      grossSalary: 73000,
      netSalary: 65570,
      epfEmployee: 5475,
      epfEmployer: 7300,
      etfEmployer: 2190
    },
    {
      id: 'EMP008',
      name: 'Jennifer Lee',
      basicSalary: 90000,
      otAmount: 16500,
      allowances: 11000,
      deductions: 3500,
      grossSalary: 117500,
      netSalary: 104825,
      epfEmployee: 8812.50,
      epfEmployer: 11750,
      etfEmployer: 3525
    }
  ];
};

export const calculatePayrollSummary = (employees: Employee[]): PayrollSummary => {
  return employees.reduce(
    (summary, employee) => ({
      totalGrossSalary: summary.totalGrossSalary + employee.grossSalary,
      totalEpfEmployee: summary.totalEpfEmployee + employee.epfEmployee,
      totalEpfEtfEmployer: summary.totalEpfEtfEmployer + employee.epfEmployer + employee.etfEmployer,
      totalNetSalary: summary.totalNetSalary + employee.netSalary
    }),
    {
      totalGrossSalary: 0,
      totalEpfEmployee: 0,
      totalEpfEtfEmployer: 0,
      totalNetSalary: 0
    }
  );
};