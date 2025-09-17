import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  Building, 
  BarChart3,
  Users,
  Clock,
  DollarSign,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AttendanceReportData {
  employeeId: string;
  employeeName: string;
  nic: string;
  date: string;
  totalWorkingHours: number;
  status: 'Present' | 'Absent' | 'On Leave' | 'Late';
}

interface PayrollReportData {
  employeeId: string;
  employeeName: string;
  nic: string;
  basicSalary: number;
  overtime: number;
  noPayDeductions: number;
  totalPayable: number;
}

interface LeaveReportData {
  employeeId: string;
  employeeName: string;
  nic: string;
  leaveType: string;
  leaveStartDate: string;
  leaveEndDate: string;
  totalLeaveDays: number;
  leaveStatus: 'Approved' | 'Pending' | 'Rejected';
  reason: string;
}

interface Department {
  id: string;
  name: string;
}

const Reports: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('Monthly');
  const [reportType, setReportType] = useState('Attendance');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockDepartments: Department[] = [
        { id: '1', name: 'Quality Control' },
        { id: '2', name: 'Manufacturing' },
        { id: '3', name: 'Safety' },
        { id: '4', name: 'Maintenance' },
        { id: '5', name: 'Logistics' },
        { id: '6', name: 'Packaging' },
        { id: '7', name: 'Human Resources' },
        { id: '8', name: 'Administration' }
      ];
      
      setDepartments(mockDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments');
    }
  };

  const generateReport = async () => {
    if (!reportType || !timePeriod) {
      setError('Please select both report type and time period');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let data: any[] = [];
      let chart: any = null;

      switch (reportType) {
        case 'Attendance':
          data = await fetchAttendanceReport();
          chart = generateAttendanceChart(data);
          break;
        case 'Payroll':
          data = await fetchPayrollReport();
          chart = generatePayrollChart(data);
          break;
        case 'Leave':
          data = await fetchLeaveReport();
          chart = generateLeaveChart(data);
          break;
      }

      setReportData(data);
      setChartData(chart);
      setReportGenerated(true);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchAttendanceReport = async (): Promise<AttendanceReportData[]> => {
    // Simulate API call - replace with actual endpoint
    const mockData: AttendanceReportData[] = [
      {
        employeeId: 'DL001',
        employeeName: 'Sarah Johnson',
        nic: '199012345678',
        date: '2024-01-15',
        totalWorkingHours: 8.5,
        status: 'Present'
      },
      {
        employeeId: 'DL002',
        employeeName: 'Mike Chen',
        nic: '198567891234',
        date: '2024-01-15',
        totalWorkingHours: 8.0,
        status: 'Present'
      },
      {
        employeeId: 'DL003',
        employeeName: 'Emily Rodriguez',
        nic: '199234567890',
        date: '2024-01-15',
        totalWorkingHours: 0,
        status: 'On Leave'
      },
      {
        employeeId: 'DL004',
        employeeName: 'David Thompson',
        nic: '198876543210',
        date: '2024-01-15',
        totalWorkingHours: 7.5,
        status: 'Late'
      },
      {
        employeeId: 'DL005',
        employeeName: 'Lisa Anderson',
        nic: '199098765432',
        date: '2024-01-15',
        totalWorkingHours: 0,
        status: 'Absent'
      }
    ];

    return selectedDepartment 
      ? mockData.filter(item => Math.random() > 0.5) // Simulate department filtering
      : mockData;
  };

  const fetchPayrollReport = async (): Promise<PayrollReportData[]> => {
    // Simulate API call - replace with actual endpoint
    const mockData: PayrollReportData[] = [
      {
        employeeId: 'DL001',
        employeeName: 'Sarah Johnson',
        nic: '199012345678',
        basicSalary: 4500,
        overtime: 150,
        noPayDeductions: 360,
        totalPayable: 4290
      },
      {
        employeeId: 'DL002',
        employeeName: 'Mike Chen',
        nic: '198567891234',
        basicSalary: 5200,
        overtime: 200,
        noPayDeductions: 416,
        totalPayable: 4984
      },
      {
        employeeId: 'DL003',
        employeeName: 'Emily Rodriguez',
        nic: '199234567890',
        basicSalary: 4800,
        overtime: 0,
        noPayDeductions: 384,
        totalPayable: 4416
      },
      {
        employeeId: 'DL004',
        employeeName: 'David Thompson',
        nic: '198876543210',
        basicSalary: 4200,
        overtime: 100,
        noPayDeductions: 336,
        totalPayable: 3964
      }
    ];

    return selectedDepartment 
      ? mockData.filter(item => Math.random() > 0.5) // Simulate department filtering
      : mockData;
  };

  const fetchLeaveReport = async (): Promise<LeaveReportData[]> => {
    // Simulate API call - replace with actual endpoint
    const mockData: LeaveReportData[] = [
      {
        employeeId: 'DL001',
        employeeName: 'Sarah Johnson',
        nic: '199012345678',
        leaveType: 'Sick Leave',
        leaveStartDate: '2024-01-20',
        leaveEndDate: '2024-01-22',
        totalLeaveDays: 3,
        leaveStatus: 'Approved',
        reason: 'Flu symptoms and fever'
      },
      {
        employeeId: 'DL002',
        employeeName: 'Mike Chen',
        nic: '198567891234',
        leaveType: 'Casual Leave',
        leaveStartDate: '2024-01-25',
        leaveEndDate: '2024-01-26',
        totalLeaveDays: 2,
        leaveStatus: 'Pending',
        reason: 'Personal family matter'
      },
      {
        employeeId: 'DL003',
        employeeName: 'Emily Rodriguez',
        nic: '199234567890',
        leaveType: 'Annual Leave',
        leaveStartDate: '2024-01-15',
        leaveEndDate: '2024-01-17',
        totalLeaveDays: 3,
        leaveStatus: 'Approved',
        reason: 'Vacation with family'
      },
      {
        employeeId: 'DL004',
        employeeName: 'David Thompson',
        nic: '198876543210',
        leaveType: 'Sick Leave',
        leaveStartDate: '2024-01-12',
        leaveEndDate: '2024-01-13',
        totalLeaveDays: 2,
        leaveStatus: 'Rejected',
        reason: 'Medical appointment'
      }
    ];

    return selectedDepartment 
      ? mockData.filter(item => Math.random() > 0.5) // Simulate department filtering
      : mockData;
  };

  const generateAttendanceChart = (data: AttendanceReportData[]) => {
    const statusCounts = data.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        label: 'Attendance Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // Green for Present
          'rgba(239, 68, 68, 0.8)',  // Red for Absent
          'rgba(249, 115, 22, 0.8)', // Orange for Late
          'rgba(250, 204, 21, 0.8)'  // Yellow for On Leave
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(250, 204, 21, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  const generatePayrollChart = (data: PayrollReportData[]) => {
    return {
      labels: data.map(item => item.employeeName),
      datasets: [
        {
          label: 'Basic Salary',
          data: data.map(item => item.basicSalary),
          backgroundColor: 'rgba(30, 58, 138, 0.8)',
          borderColor: 'rgba(30, 58, 138, 1)',
          borderWidth: 2
        },
        {
          label: 'Overtime',
          data: data.map(item => item.overtime),
          backgroundColor: 'rgba(250, 204, 21, 0.8)',
          borderColor: 'rgba(250, 204, 21, 1)',
          borderWidth: 2
        }
      ]
    };
  };

  const generateLeaveChart = (data: LeaveReportData[]) => {
    const leaveTypeCounts = data.reduce((acc, record) => {
      acc[record.leaveType] = (acc[record.leaveType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(leaveTypeCounts),
      datasets: [{
        label: 'Leave Types',
        data: Object.values(leaveTypeCounts),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // Blue
          'rgba(16, 185, 129, 0.8)',  // Green
          'rgba(245, 158, 11, 0.8)',  // Yellow
          'rgba(239, 68, 68, 0.8)'    // Red
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  const downloadReport = () => {
    if (!reportData.length) return;

    let headers: string[] = [];
    let csvData: string[][] = [];

    switch (reportType) {
      case 'Attendance':
        headers = ['Employee ID', 'Employee Name', 'NIC', 'Date', 'Total Working Hours', 'Status'];
        csvData = (reportData as AttendanceReportData[]).map(item => [
          item.employeeId,
          item.employeeName,
          item.nic,
          item.date,
          item.totalWorkingHours.toString(),
          item.status
        ]);
        break;
      case 'Payroll':
        headers = ['Employee ID', 'Employee Name', 'NIC', 'Basic Salary', 'Overtime', 'No Pay Deductions', 'Total Payable'];
        csvData = (reportData as PayrollReportData[]).map(item => [
          item.employeeId,
          item.employeeName,
          item.nic,
          item.basicSalary.toString(),
          item.overtime.toString(),
          item.noPayDeductions.toString(),
          item.totalPayable.toString()
        ]);
        break;
      case 'Leave':
        headers = ['Employee ID', 'Employee Name', 'NIC', 'Leave Type', 'Start Date', 'End Date', 'Total Days', 'Status', 'Reason'];
        csvData = (reportData as LeaveReportData[]).map(item => [
          item.employeeId,
          item.employeeName,
          item.nic,
          item.leaveType,
          item.leaveStartDate,
          item.leaveEndDate,
          item.totalLeaveDays.toString(),
          item.leaveStatus,
          item.reason
        ]);
        break;
    }

    const csvContent = [
      `DairyLicious HR Report - ${reportType} (${timePeriod})`,
      `Generated on: ${new Date().toLocaleDateString()}`,
      `Department: ${selectedDepartment || 'All Departments'}`,
      '',
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DairyLicious_${reportType}_Report_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Absent':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Late':
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderAttendanceTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NIC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Working Hours
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(reportData as AttendanceReportData[]).map((record, index) => (
            <tr key={`${record.employeeId}-${record.date}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {record.employeeId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.employeeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.nic}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(record.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.totalWorkingHours.toFixed(1)}h
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPayrollTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NIC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Basic Salary
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Overtime
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No Pay Deductions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Payable
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(reportData as PayrollReportData[]).map((record, index) => (
            <tr key={record.employeeId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {record.employeeId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.employeeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.nic}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${record.basicSalary.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                +${record.overtime.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                -${record.noPayDeductions.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                ${record.totalPayable.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={6} className="px-6 py-4 text-sm font-bold text-gray-900">
              Total Payroll
            </td>
            <td className="px-6 py-4 text-sm font-bold text-blue-600">
              ${(reportData as PayrollReportData[]).reduce((sum, record) => sum + record.totalPayable, 0).toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const renderLeaveTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NIC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Leave Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(reportData as LeaveReportData[]).map((record, index) => (
            <tr key={`${record.employeeId}-${record.leaveStartDate}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {record.employeeId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.employeeName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.nic}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.leaveType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(record.leaveStartDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(record.leaveEndDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.totalLeaveDays}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.leaveStatus)}`}>
                  {record.leaveStatus}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {record.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: `${reportType} Summary - ${timePeriod}`,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 16,
          weight: '600',
        },
        padding: 20,
      },
    },
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HR Reports</h1>
            <p className="text-gray-600 mt-1">Generate and download comprehensive HR reports</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>Professional Reports</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Report Filters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Time Period Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Time Period
              </label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            {/* Report Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BarChart3 className="h-4 w-4 inline mr-1" />
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Attendance">Attendance</option>
                <option value="Payroll">Payroll</option>
                <option value="Leave">Leave</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 inline mr-1" />
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <FileText className="h-4 w-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
              </button>
            </div>
          </div>

          {/* Report Summary */}
          {reportGenerated && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900">Report Generated Successfully</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {reportType} report for {timePeriod.toLowerCase()} period
                    {selectedDepartment && ` - ${selectedDepartment} department`}
                  </p>
                </div>
                <button
                  onClick={downloadReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview Section */}
      {reportGenerated && reportData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Chart</h3>
              <div className="h-64">
                {chartData && (
                  reportType === 'Attendance' || reportType === 'Leave' ? (
                    <Pie data={chartData} options={chartOptions} />
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {reportType} Report - {timePeriod}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {reportData.length} records found
                      {selectedDepartment && ` in ${selectedDepartment}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Report Ready</span>
                  </div>
                </div>
              </div>

              {reportType === 'Attendance' && renderAttendanceTable()}
              {reportType === 'Payroll' && renderPayrollTable()}
              {reportType === 'Leave' && renderLeaveTable()}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!reportGenerated && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Your First Report</h3>
            <p className="text-gray-600 mb-6">
              Select your filters above and click "Generate Report" to create professional HR reports with dynamic data from your system.
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>Attendance Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>Payroll Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-4 w-4 text-yellow-600" />
                <span>Leave Management</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;