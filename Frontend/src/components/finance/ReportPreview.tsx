import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, PiggyBank, Wallet } from 'lucide-react';
import { PayrollReportData, PerformanceReportData, ReportMetadata } from '../types/reports';

interface ReportPreviewProps {
  reportType: 'Payroll' | 'Performance';
  payrollData?: PayrollReportData;
  performanceData?: PerformanceReportData;
  metadata: ReportMetadata;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportType,
  payrollData,
  performanceData,
  metadata
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (reportType === 'Payroll' && payrollData) {
    return (
      <div id="report-preview" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Report Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DL</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{metadata.companyName}</h1>
                  <p className="text-gray-600">Dairy Products Manufacturing</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800">{metadata.reportTitle}</h2>
              <p className="text-gray-600">{metadata.timePeriod}</p>
              <p className="text-sm text-gray-500">Generated: {metadata.generatedDate} at {metadata.generatedTime}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              {payrollData.previousPeriodComparison && (
                <div className="flex items-center space-x-1">
                  {getChangeIcon(payrollData.previousPeriodComparison.grossSalaryChange)}
                  <span className={`text-sm font-medium ${getChangeColor(payrollData.previousPeriodComparison.grossSalaryChange)}`}>
                    {formatPercentage(payrollData.previousPeriodComparison.grossSalaryChange)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Gross Salary</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(payrollData.totalGrossSalary)}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">EPF Employee</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(payrollData.totalEpfEmployee)}</p>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">EPF & ETF Employer</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(payrollData.totalEpfEmployer + payrollData.totalEtfEmployer)}</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              {payrollData.previousPeriodComparison && (
                <div className="flex items-center space-x-1">
                  {getChangeIcon(payrollData.previousPeriodComparison.netSalaryChange)}
                  <span className={`text-sm font-medium ${getChangeColor(payrollData.previousPeriodComparison.netSalaryChange)}`}>
                    {formatPercentage(payrollData.previousPeriodComparison.netSalaryChange)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Net Salary</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(payrollData.totalNetSalary)}</p>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payroll Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Employees:</span>
                  <span className="font-semibold">{payrollData.totalEmployees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Gross Salary:</span>
                  <span className="font-semibold">{formatCurrency(payrollData.totalGrossSalary / payrollData.totalEmployees)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Net Salary:</span>
                  <span className="font-semibold">{formatCurrency(payrollData.totalNetSalary / payrollData.totalEmployees)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">EPF Employee (8%):</span>
                  <span className="font-semibold">{formatCurrency(payrollData.totalEpfEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EPF Employer (12%):</span>
                  <span className="font-semibold">{formatCurrency(payrollData.totalEpfEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ETF Employer (3%):</span>
                  <span className="font-semibold">{formatCurrency(payrollData.totalEtfEmployer)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reportType === 'Performance' && performanceData) {
    const chartData = performanceData.monthlyData || [
      { period: 'Current', revenue: performanceData.totalRevenue, expenses: performanceData.totalExpenses, profit: performanceData.totalProfit }
    ];

    return (
      <div id="report-preview" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Report Header */}
        <div className="border-b border-gray-200 pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DL</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{metadata.companyName}</h1>
                  <p className="text-gray-600">Dairy Products Manufacturing</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-800">{metadata.reportTitle}</h2>
              <p className="text-gray-600">{metadata.timePeriod}</p>
              <p className="text-sm text-gray-500">Generated: {metadata.generatedDate} at {metadata.generatedTime}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              {performanceData.previousPeriodComparison && (
                <div className="flex items-center space-x-1">
                  {getChangeIcon(performanceData.previousPeriodComparison.revenueChange)}
                  <span className={`text-sm font-medium ${getChangeColor(performanceData.previousPeriodComparison.revenueChange)}`}>
                    {formatPercentage(performanceData.previousPeriodComparison.revenueChange)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(performanceData.totalRevenue)}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              {performanceData.previousPeriodComparison && (
                <div className="flex items-center space-x-1">
                  {getChangeIcon(performanceData.previousPeriodComparison.expensesChange)}
                  <span className={`text-sm font-medium ${getChangeColor(performanceData.previousPeriodComparison.expensesChange)}`}>
                    {formatPercentage(performanceData.previousPeriodComparison.expensesChange)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Expenses</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(performanceData.totalExpenses)}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              {performanceData.previousPeriodComparison && (
                <div className="flex items-center space-x-1">
                  {getChangeIcon(performanceData.previousPeriodComparison.profitChange)}
                  <span className={`text-sm font-medium ${getChangeColor(performanceData.previousPeriodComparison.profitChange)}`}>
                    {formatPercentage(performanceData.previousPeriodComparison.profitChange)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Net Profit</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(performanceData.totalProfit)}</p>
            <p className="text-sm text-gray-600 mt-1">Margin: {performanceData.profitMargin.toFixed(1)}%</p>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Performance</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} tickFormatter={formatCurrency} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" name="Revenue" fill="#FACC15" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatCurrency(performanceData.expenseBreakdown.salaries)}
              </div>
              <div className="text-sm text-gray-600">Salaries</div>
              <div className="text-xs text-gray-500">
                {((performanceData.expenseBreakdown.salaries / performanceData.totalExpenses) * 100).toFixed(1)}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {formatCurrency(performanceData.expenseBreakdown.milkPurchases)}
              </div>
              <div className="text-sm text-gray-600">Milk Purchases</div>
              <div className="text-xs text-gray-500">
                {((performanceData.expenseBreakdown.milkPurchases / performanceData.totalExpenses) * 100).toFixed(1)}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {formatCurrency(performanceData.expenseBreakdown.additionalExpenses)}
              </div>
              <div className="text-sm text-gray-600">Additional Expenses</div>
              <div className="text-xs text-gray-500">
                {((performanceData.expenseBreakdown.additionalExpenses / performanceData.totalExpenses) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ReportPreview;