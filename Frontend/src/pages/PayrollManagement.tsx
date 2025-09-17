import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Lock, 
  Download, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  DollarSign,
  Clock,
  Users,
  FileText,
  Eye,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Employee, AttendanceRecord } from '../data/mockData';
import PayrollConfigModal from '../components/PayrollConfigModal';
import PayrollHistoryModal from '../components/PayrollHistoryModal';

interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  baseSalary: number;
  overtimeHours: number;
  overtimePay: number;
  allowances: number;
  epfDeduction: number;
  etfDeduction: number;
  otherDeductions: number;
  totalPayable: number;
  status: 'draft' | 'calculated' | 'finalized' | 'exported';
  calculatedAt?: string;
  finalizedAt?: string;
  exportedAt?: string;
}

interface PayrollConfig {
  epfRate: number;
  etfRate: number;
  overtimeRate: number;
  standardHours: number;
  allowances: {
    transport: number;
    meal: number;
    medical: number;
  };
}

interface PayrollManagementProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onPayrollUpdate: (totalExpense: number) => void;
}

const PayrollManagement: React.FC<PayrollManagementProps> = ({ 
  employees, 
  attendanceRecords, 
  onPayrollUpdate 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [payrollStatus, setPayrollStatus] = useState<'draft' | 'calculated' | 'finalized' | 'exported'>('draft');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [payrollConfig, setPayrollConfig] = useState<PayrollConfig>({
    epfRate: 8.0, // 8% EPF
    etfRate: 3.0, // 3% ETF
    overtimeRate: 1.5, // 1.5x base rate
    standardHours: 8, // 8 hours per day
    allowances: {
      transport: 150,
      meal: 100,
      medical: 200
    }
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calculate attendance data for selected month
  const monthlyAttendance = useMemo(() => {
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    
    const monthRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });

    const attendanceMap = new Map();
    
    employees.forEach(employee => {
      const empRecords = monthRecords.filter(r => r.employeeId === employee.id);
      const presentDays = empRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
      const totalHours = empRecords.reduce((sum, record) => {
        if (record.clockIn && record.clockOut) {
          const clockIn = new Date(`2000-01-01T${record.clockIn}`);
          const clockOut = new Date(`2000-01-01T${record.clockOut}`);
          const hours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
          return sum + hours;
        }
        return sum;
      }, 0);
      
      const standardHours = presentDays * payrollConfig.standardHours;
      const overtimeHours = Math.max(0, totalHours - standardHours);
      
      attendanceMap.set(employee.id, {
        presentDays,
        totalHours,
        overtimeHours,
        standardHours
      });
    });

    return attendanceMap;
  }, [attendanceRecords, selectedMonth, selectedYear, employees, payrollConfig.standardHours]);

  const calculatePayroll = async () => {
    setIsCalculating(true);
    setErrors([]);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate calculation time
      
      const newPayrollRecords: PayrollRecord[] = [];
      const validationErrors: string[] = [];

      employees.forEach(employee => {
        if (employee.status !== 'Active') return;

        const attendance = monthlyAttendance.get(employee.id);
        if (!attendance) {
          validationErrors.push(`Missing attendance data for ${employee.name}`);
          return;
        }

        const baseSalary = employee.salary;
        const hourlyRate = baseSalary / (30 * payrollConfig.standardHours); // Approximate hourly rate
        const overtimePay = attendance.overtimeHours * hourlyRate * payrollConfig.overtimeRate;
        
        const totalAllowances = Object.values(payrollConfig.allowances).reduce((sum, allowance) => sum + allowance, 0);
        
        const grossSalary = baseSalary + overtimePay + totalAllowances;
        const epfDeduction = employee.epfEligible ? (grossSalary * payrollConfig.epfRate / 100) : 0;
        const etfDeduction = employee.etfEligible ? (grossSalary * payrollConfig.etfRate / 100) : 0;
        
        const totalDeductions = epfDeduction + etfDeduction;
        const totalPayable = grossSalary - totalDeductions;

        newPayrollRecords.push({
          id: `payroll_${employee.id}_${selectedYear}_${selectedMonth}`,
          employeeId: employee.id,
          month: months[selectedMonth],
          year: selectedYear,
          baseSalary,
          overtimeHours: attendance.overtimeHours,
          overtimePay,
          allowances: totalAllowances,
          epfDeduction,
          etfDeduction,
          otherDeductions: 0,
          totalPayable,
          status: 'calculated',
          calculatedAt: new Date().toISOString()
        });
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
      } else {
        setPayrollRecords(newPayrollRecords);
        setPayrollStatus('calculated');
        
        // Update dashboard payroll expense
        const totalExpense = newPayrollRecords.reduce((sum, record) => sum + record.totalPayable, 0);
        onPayrollUpdate(totalExpense);
      }
    } catch (error) {
      setErrors(['Error calculating payroll. Please try again.']);
    } finally {
      setIsCalculating(false);
    }
  };

  const finalizePayroll = () => {
    const finalizedRecords = payrollRecords.map(record => ({
      ...record,
      status: 'finalized' as const,
      finalizedAt: new Date().toISOString()
    }));
    
    setPayrollRecords(finalizedRecords);
    setPayrollStatus('finalized');
  };

  const exportPayroll = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate export time
      
      // Generate CSV for export
      const headers = [
        'Employee ID', 'Employee Name', 'Department', 'Base Salary', 
        'Overtime Hours', 'Overtime Pay', 'Allowances', 'EPF Deduction', 
        'ETF Deduction', 'Total Payable'
      ];
      
      const csvContent = [
        headers.join(','),
        ...payrollRecords.map(record => {
          const employee = employees.find(emp => emp.id === record.employeeId);
          return [
            employee?.employeeId || '',
            employee?.name || '',
            employee?.department || '',
            record.baseSalary,
            record.overtimeHours.toFixed(1),
            record.overtimePay.toFixed(2),
            record.allowances.toFixed(2),
            record.epfDeduction.toFixed(2),
            record.etfDeduction.toFixed(2),
            record.totalPayable.toFixed(2)
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll_${months[selectedMonth]}_${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      const exportedRecords = payrollRecords.map(record => ({
        ...record,
        status: 'exported' as const,
        exportedAt: new Date().toISOString()
      }));
      
      setPayrollRecords(exportedRecords);
      setPayrollStatus('exported');
    } catch (error) {
      setErrors(['Error exporting payroll. Please try again.']);
    } finally {
      setIsExporting(false);
    }
  };

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.totalPayable, 0);
  const totalEmployees = payrollRecords.length;
  const totalOvertimeHours = payrollRecords.reduce((sum, record) => sum + record.overtimeHours, 0);
  const totalDeductions = payrollRecords.reduce((sum, record) => sum + record.epfDeduction + record.etfDeduction, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'calculated':
        return 'bg-blue-100 text-blue-800';
      case 'finalized':
        return 'bg-yellow-100 text-yellow-800';
      case 'exported':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
            <p className="text-gray-600 mt-1">Calculate and manage employee salaries and deductions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span>History</span>
            </button>
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Configuration</span>
            </button>
          </div>
        </div>

        {/* Month/Year Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payrollStatus)}`}>
                {payrollStatus.charAt(0).toUpperCase() + payrollStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Payroll</p>
              <p className="text-2xl font-bold text-green-600">${totalPayroll.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Overtime Hours</p>
              <p className="text-2xl font-bold text-orange-600">{totalOvertimeHours.toFixed(1)}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Deductions</p>
              <p className="text-2xl font-bold text-red-600">${totalDeductions.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={calculatePayroll}
            disabled={isCalculating || payrollStatus === 'finalized' || payrollStatus === 'exported'}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Calculator className="h-5 w-5" />
            <span>{isCalculating ? 'Calculating...' : 'Calculate Payroll'}</span>
          </button>

          <button
            onClick={finalizePayroll}
            disabled={payrollStatus !== 'calculated'}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Lock className="h-5 w-5" />
            <span>Finalize Payroll</span>
          </button>

          <button
            onClick={exportPayroll}
            disabled={payrollStatus !== 'finalized' || isExporting}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Download className="h-5 w-5" />
            <span>{isExporting ? 'Exporting...' : 'Export to Finance'}</span>
          </button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Validation Errors</h3>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {payrollStatus === 'exported' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Payroll Exported Successfully</h3>
              <p className="text-sm text-green-700 mt-1">
                Payroll data for {months[selectedMonth]} {selectedYear} has been exported to Finance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Table */}
      {payrollRecords.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Payroll Sheet - {months[selectedMonth]} {selectedYear}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {payrollRecords.length} employees processed
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allowances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EPF Deduction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETF Deduction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Payable
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollRecords.map((record, index) => {
                  const employee = employees.find(emp => emp.id === record.employeeId);
                  if (!employee) return null;

                  return (
                    <tr 
                      key={record.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.baseSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">${record.overtimePay.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{record.overtimeHours.toFixed(1)}h</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.allowances.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -${record.epfDeduction.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        -${record.etfDeduction.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ${record.totalPayable.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900" colSpan={6}>
                    Total Payroll
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    ${totalPayroll.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {payrollRecords.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Payroll Calculated</h3>
          <p className="text-gray-600 mb-6">
            Click "Calculate Payroll" to generate salary calculations for {months[selectedMonth]} {selectedYear}
          </p>
          <button
            onClick={calculatePayroll}
            disabled={isCalculating}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-medium mx-auto"
          >
            <Calculator className="h-5 w-5" />
            <span>{isCalculating ? 'Calculating...' : 'Calculate Payroll'}</span>
          </button>
        </div>
      )}

      {/* Modals */}
      {showConfigModal && (
        <PayrollConfigModal
          config={payrollConfig}
          onClose={() => setShowConfigModal(false)}
          onSave={setPayrollConfig}
        />
      )}

      {showHistoryModal && (
        <PayrollHistoryModal
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
};

export default PayrollManagement;