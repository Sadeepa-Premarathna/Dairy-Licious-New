import React, { useState } from 'react';
import { X, FileText, Download, Eye, Calendar } from 'lucide-react';

interface PayrollHistoryRecord {
  id: string;
  month: string;
  year: number;
  totalEmployees: number;
  totalPayroll: number;
  status: 'exported' | 'finalized';
  exportedAt: string;
  exportedBy: string;
}

interface PayrollHistoryModalProps {
  onClose: () => void;
}

const PayrollHistoryModal: React.FC<PayrollHistoryModalProps> = ({ onClose }) => {
  const [selectedYear, setSelectedYear] = useState(2024);

  // Mock historical data
  const historyRecords: PayrollHistoryRecord[] = [
    {
      id: 'payroll_2024_0',
      month: 'January',
      year: 2024,
      totalEmployees: 252,
      totalPayroll: 1234567,
      status: 'exported',
      exportedAt: '2024-02-01T10:30:00Z',
      exportedBy: 'Alex Martinez'
    },
    {
      id: 'payroll_2023_11',
      month: 'December',
      year: 2023,
      totalEmployees: 248,
      totalPayroll: 1198432,
      status: 'exported',
      exportedAt: '2024-01-02T14:15:00Z',
      exportedBy: 'Alex Martinez'
    },
    {
      id: 'payroll_2023_10',
      month: 'November',
      year: 2023,
      totalEmployees: 245,
      totalPayroll: 1156789,
      status: 'exported',
      exportedAt: '2023-12-01T09:45:00Z',
      exportedBy: 'Alex Martinez'
    },
    {
      id: 'payroll_2023_9',
      month: 'October',
      year: 2023,
      totalEmployees: 242,
      totalPayroll: 1134567,
      status: 'exported',
      exportedAt: '2023-11-01T11:20:00Z',
      exportedBy: 'Alex Martinez'
    }
  ];

  const filteredRecords = historyRecords.filter(record => record.year === selectedYear);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exported':
        return 'bg-green-100 text-green-800';
      case 'finalized':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadPayrollReport = (record: PayrollHistoryRecord) => {
    // Simulate downloading a payroll report
    const csvContent = `Payroll Report - ${record.month} ${record.year}\n\nTotal Employees: ${record.totalEmployees}\nTotal Payroll: $${record.totalPayroll.toLocaleString()}\nExported: ${new Date(record.exportedAt).toLocaleDateString()}\nExported By: ${record.exportedBy}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_report_${record.month}_${record.year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Payroll History</h2>
              <p className="text-gray-600 mt-1">View and download historical payroll records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Year Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                </select>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employees
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Payroll
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exported
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record, index) => (
                    <tr 
                      key={record.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.month} {record.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.totalEmployees}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${record.totalPayroll.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{new Date(record.exportedAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">by {record.exportedBy}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadPayrollReport(record)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payroll records found for {selectedYear}.</p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {filteredRecords.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{selectedYear} Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Periods:</span>
                  <span className="ml-2 font-medium">{filteredRecords.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Average Employees:</span>
                  <span className="ml-2 font-medium">
                    {Math.round(filteredRecords.reduce((sum, r) => sum + r.totalEmployees, 0) / filteredRecords.length)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Payroll:</span>
                  <span className="ml-2 font-medium text-green-600">
                    ${filteredRecords.reduce((sum, r) => sum + r.totalPayroll, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollHistoryModal;