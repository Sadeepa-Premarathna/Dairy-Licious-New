import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Users, Download, Upload, Search, Filter, ChevronLeft, ChevronRight, Edit, Check, X, AlertCircle } from 'lucide-react';
import { AttendanceRecord, Employee } from '../data/mockData';
import AttendanceCorrectionModal from '../components/HRAttendanceCorrectionModal';
import BulkUploadModal from '../components/HRBulkUploadModal';

interface AttendanceTrackingProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onAttendanceUpdate: (records: AttendanceRecord[]) => void;
}

const AttendanceTracking: React.FC<AttendanceTrackingProps> = ({ 
  employees, 
  attendanceRecords, 
  onAttendanceUpdate 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique departments
  const departments = useMemo(() => 
    [...new Set(employees.map(emp => emp.department))].sort(), 
    [employees]
  );

  // Filter attendance records for selected date
  const dailyRecords = useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    return attendanceRecords.filter(record => record.date === dateStr);
  }, [attendanceRecords, selectedDate]);

  // Filter and search records
  const filteredRecords = useMemo(() => {
    let filtered = dailyRecords;

    if (searchTerm) {
      filtered = filtered.filter(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        return employee && (
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedDepartment) {
      filtered = filtered.filter(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        return employee && employee.department === selectedDepartment;
      });
    }

    if (selectedStatus) {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    return filtered;
  }, [dailyRecords, searchTerm, selectedDepartment, selectedStatus, employees]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-800';
      case 'Absent':
        return 'bg-red-100 text-red-800';
      case 'Late':
        return 'bg-orange-100 text-orange-800';
      case 'Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return '✓';
      case 'Absent':
        return '✗';
      case 'Late':
        return '⏰';
      case 'Leave':
        return '🟡';
      default:
        return '?';
    }
  };

  const calculateHoursWorked = (clockIn: string, clockOut: string) => {
    if (!clockIn || !clockOut) return '0.0';
    
    const inTime = new Date(`2000-01-01T${clockIn}`);
    const outTime = new Date(`2000-01-01T${clockOut}`);
    const diffMs = outTime.getTime() - inTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    
    return hours.toFixed(1);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Clock In', 'Clock Out', 'Hours Worked', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        return [
          record.date,
          employee?.employeeId || '',
          employee?.name || '',
          employee?.department || '',
          record.clockIn || '',
          record.clockOut || '',
          calculateHoursWorked(record.clockIn || '', record.clockOut || ''),
          record.status
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate.toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCorrection = (correctedRecord: AttendanceRecord) => {
    const updatedRecords = attendanceRecords.map(record => 
      record.id === correctedRecord.id ? correctedRecord : record
    );
    onAttendanceUpdate(updatedRecords);
    setShowCorrectionModal(false);
    setSelectedRecord(null);
  };

  const handleBulkUpload = (newRecords: AttendanceRecord[]) => {
    const updatedRecords = [...attendanceRecords, ...newRecords];
    onAttendanceUpdate(updatedRecords);
    setShowBulkUploadModal(false);
  };

  // Get missing entries (employees without attendance records for selected date)
  const missingEntries = employees.filter(emp => 
    emp.status === 'Active' && 
    !dailyRecords.some(record => record.employeeId === emp.id)
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor and manage employee attendance records</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Bulk Upload</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Date Navigation and View Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['daily', 'weekly', 'monthly'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDepartment('');
                      setSelectedStatus('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Missing Entries Alert */}
      {missingEntries.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Missing Attendance Entries</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {missingEntries.length} employees have no attendance records for {selectedDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredRecords.filter(r => r.status === 'Present').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Absent</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredRecords.filter(r => r.status === 'Absent').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Late</p>
              <p className="text-2xl font-bold text-orange-600">
                {filteredRecords.filter(r => r.status === 'Late').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredRecords.filter(r => r.status === 'Leave').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Attendance Records</h3>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredRecords.length} records for {selectedDate.toLocaleDateString()}
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
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clock Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record, index) => {
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
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockIn || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.clockOut || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {calculateHoursWorked(record.clockIn || '', record.clockOut || '')}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getStatusIcon(record.status)}</span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowCorrectionModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No attendance records found for the selected criteria.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCorrectionModal && selectedRecord && (
        <AttendanceCorrectionModal
          record={selectedRecord}
          employee={employees.find(emp => emp.id === selectedRecord.employeeId)!}
          onClose={() => {
            setShowCorrectionModal(false);
            setSelectedRecord(null);
          }}
          onSave={handleCorrection}
        />
      )}

      {showBulkUploadModal && (
        <BulkUploadModal
          onClose={() => setShowBulkUploadModal(false)}
          onUpload={handleBulkUpload}
          employees={employees}
        />
      )}
    </div>
  );
};

export default AttendanceTracking;