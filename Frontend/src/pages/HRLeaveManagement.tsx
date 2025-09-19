import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Check, 
  X, 
  Filter, 
  Search,
  FileText,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Annual Leave' | 'Maternity Leave';
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

interface ApplyLeaveForm {
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
}

const LeaveManagement: React.FC = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  // Mock data for leave requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeId: 'DL001',
      employeeName: 'Sarah Johnson',
      leaveType: 'Sick Leave',
      fromDate: '2024-01-20',
      toDate: '2024-01-22',
      reason: 'Flu symptoms and fever',
      status: 'Pending',
      appliedDate: '2024-01-18'
    },
    {
      id: '2',
      employeeId: 'DL002',
      employeeName: 'Mike Chen',
      leaveType: 'Casual Leave',
      fromDate: '2024-01-25',
      toDate: '2024-01-26',
      reason: 'Personal family matter',
      status: 'Pending',
      appliedDate: '2024-01-17'
    },
    {
      id: '3',
      employeeId: 'DL003',
      employeeName: 'Emily Rodriguez',
      leaveType: 'Annual Leave',
      fromDate: '2024-01-15',
      toDate: '2024-01-17',
      reason: 'Vacation with family',
      status: 'Approved',
      appliedDate: '2024-01-10',
      approvedBy: 'Alex Martinez',
      approvedDate: '2024-01-12'
    },
    {
      id: '4',
      employeeId: 'DL004',
      employeeName: 'David Thompson',
      leaveType: 'Sick Leave',
      fromDate: '2024-01-12',
      toDate: '2024-01-13',
      reason: 'Medical appointment',
      status: 'Rejected',
      appliedDate: '2024-01-11',
      approvedBy: 'Alex Martinez',
      approvedDate: '2024-01-12'
    },
    {
      id: '5',
      employeeId: 'DL005',
      employeeName: 'Lisa Anderson',
      leaveType: 'Casual Leave',
      fromDate: '2024-01-08',
      toDate: '2024-01-09',
      reason: 'Wedding ceremony',
      status: 'Approved',
      appliedDate: '2024-01-05',
      approvedBy: 'Alex Martinez',
      approvedDate: '2024-01-06'
    }
  ]);

  // Apply Leave Form State
  const [applyLeaveForm, setApplyLeaveForm] = useState<ApplyLeaveForm>({
    employeeName: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  // Mock employee list for dropdown
  const employees = [
    'Sarah Johnson',
    'Mike Chen',
    'Emily Rodriguez',
    'David Thompson',
    'Lisa Anderson',
    'James Wilson',
    'Maria Garcia',
    'Robert Kim',
    'Jennifer Brown',
    'Thomas Lee',
    'Amanda Davis'
  ];

  const leaveTypes = [
    'Sick Leave',
    'Casual Leave',
    'Annual Leave',
    'Maternity Leave'
  ];

  // Filter requests based on search and filters
  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || request.status === statusFilter;
    const matchesLeaveType = !leaveTypeFilter || request.leaveType === leaveTypeFilter;
    
    return matchesSearch && matchesStatus && matchesLeaveType;
  });

  const pendingRequests = filteredRequests.filter(request => request.status === 'Pending');
  const historyRequests = filteredRequests.filter(request => request.status !== 'Pending');

  // Handle status change (Approve/Reject)
  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setLeaveRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: newStatus,
            approvedBy: 'Alex Martinez',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : request
    ));
  };

  // Handle apply leave form submission
  const handleApplyLeave = () => {
    if (!applyLeaveForm.employeeName || !applyLeaveForm.leaveType || 
        !applyLeaveForm.fromDate || !applyLeaveForm.toDate || !applyLeaveForm.reason) {
      alert('Please fill in all required fields');
      return;
    }

    const newLeaveRequest: LeaveRequest = {
      id: (leaveRequests.length + 1).toString(),
      employeeId: `DL${(leaveRequests.length + 1).toString().padStart(3, '0')}`,
      employeeName: applyLeaveForm.employeeName,
      leaveType: applyLeaveForm.leaveType as LeaveRequest['leaveType'],
      fromDate: applyLeaveForm.fromDate,
      toDate: applyLeaveForm.toDate,
      reason: applyLeaveForm.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests(prev => [...prev, newLeaveRequest]);
    setApplyLeaveForm({
      employeeName: '',
      leaveType: '',
      fromDate: '',
      toDate: '',
      reason: ''
    });
    setShowApplyModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const calculateDays = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600 mt-1">Manage employee leave requests and approvals</p>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Apply Leave</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by employee name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Leave Types</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">
                {leaveRequests.filter(r => r.status === 'Approved' && r.approvedDate === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">On Leave Today</p>
              <p className="text-2xl font-bold text-blue-600">
                {leaveRequests.filter(r => {
                  const today = new Date().toISOString().split('T')[0];
                  return r.status === 'Approved' && r.fromDate <= today && r.toDate >= today;
                }).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Requests</p>
              <p className="text-2xl font-bold text-gray-600">{leaveRequests.length}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending Requests ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Leave History ({historyRequests.length})
            </button>
          </nav>
        </div>

        {/* Pending Requests Table */}
        {activeTab === 'pending' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map((request, index) => (
                  <tr key={request.id} className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {request.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                          <div className="text-sm text-gray-500">{request.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{calculateDays(request.fromDate, request.toDate)} days</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(request.id, 'Approved')}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(request.id, 'Rejected')}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <X className="h-3 w-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pendingRequests.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending leave requests found.</p>
              </div>
            )}
          </div>
        )}

        {/* Leave History Table */}
        {activeTab === 'history' && (
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
                    Leave Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved By
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historyRequests.map((request, index) => (
                  <tr key={request.id} className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {request.employeeName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.leaveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.fromDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.toDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.approvedBy || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {historyRequests.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No leave history found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Employee Name Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={applyLeaveForm.employeeName}
                    onChange={(e) => setApplyLeaveForm({...applyLeaveForm, employeeName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee} value={employee}>{employee}</option>
                    ))}
                  </select>
                </div>

                {/* Leave Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={applyLeaveForm.leaveType}
                    onChange={(e) => setApplyLeaveForm({...applyLeaveForm, leaveType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Leave Type</option>
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={applyLeaveForm.fromDate}
                      onChange={(e) => setApplyLeaveForm({...applyLeaveForm, fromDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={applyLeaveForm.toDate}
                      onChange={(e) => setApplyLeaveForm({...applyLeaveForm, toDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Reason Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={applyLeaveForm.reason}
                    onChange={(e) => setApplyLeaveForm({...applyLeaveForm, reason: e.target.value})}
                    rows={4}
                    placeholder="Please provide a reason for your leave request..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Duration Display */}
                {applyLeaveForm.fromDate && applyLeaveForm.toDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Duration:</strong> {calculateDays(applyLeaveForm.fromDate, applyLeaveForm.toDate)} days
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyLeave}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;