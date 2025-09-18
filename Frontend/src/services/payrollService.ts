import { Employee, EmployeeAllowance } from '../types/payroll';
import { Allowance } from '../types/allowance';
import { allowanceService } from './allowanceService';

export const payrollService = {
  // Calculate total allowances for an employee in a specific month
  async getEmployeeAllowances(employeeId: string, month: string): Promise<number> {
    try {
      const allowances = await allowanceService.getAllAllowances({ 
        employeeId, 
        month 
      });
      return allowances.reduce((total, allowance) => total + allowance.amount, 0);
    } catch (error) {
      console.error('Error fetching employee allowances:', error);
      return 0;
    }
  },

  // Calculate total allowances for all employees in a specific month
  async getAllEmployeeAllowances(month: string): Promise<EmployeeAllowance[]> {
    try {
      const allowances = await allowanceService.getAllAllowances({ month });
      return allowances.map(allowance => ({
        id: allowance.id,
        employeeId: allowance.employeeId,
        employeeName: allowance.employeeName,
        allowanceType: allowance.allowanceType,
        amount: allowance.amount,
        month: allowance.month
      }));
    } catch (error) {
      console.error('Error fetching all employee allowances:', error);
      return [];
    }
  },

  // Recalculate employee salary with allowances
  calculateEmployeeSalaryWithAllowances(
    employee: Employee, 
    additionalAllowances: number = 0
  ): Employee {
    const totalAllowances = employee.allowances + additionalAllowances;
    const grossSalary = employee.basicSalary + employee.otAmount + totalAllowances;
    const epfEmployee = (employee.basicSalary + employee.otAmount) * 0.08;
    const epfEmployer = (employee.basicSalary + employee.otAmount) * 0.12;
    const etfEmployer = (employee.basicSalary + employee.otAmount) * 0.03;
    const netSalary = grossSalary - employee.deductions - epfEmployee;

    return {
      ...employee,
      allowances: totalAllowances,
      grossSalary,
      netSalary,
      epfEmployee,
      epfEmployer,
      etfEmployer
    };
  }
};
