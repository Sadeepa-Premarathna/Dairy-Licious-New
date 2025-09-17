import React, { useState } from 'react';
import { X, Edit, UserX, Phone, Mail, MapPin, Calendar, DollarSign, Building, User } from 'lucide-react';
import { Employee } from '../data/mockData';

interface EmployeeDetailModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdate: (employee: Employee) => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee);

  const handleSave = () => {
    onUpdate(editedEmployee);
    setIsEditing(false);
  };

  const handleDeactivate = () => {
    const deactivatedEmployee = { ...employee, status: 'Resigned' as const };
    onUpdate(deactivatedEmployee);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Resigned':
        return 'bg-red-100 text-red-800';
      case 'On Probation':
        return 'bg-orange-100 text-orange-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {employee.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
              <p className="text-gray-600">{employee.role}</p>
            </div>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
              {employee.status}
            </span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedEmployee.name}
                          onChange={(e) => setEditedEmployee({...editedEmployee, name: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{employee.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedEmployee.dateOfBirth}
                          onChange={(e) => setEditedEmployee({...editedEmployee, dateOfBirth: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {new Date(employee.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedEmployee.phone}
                          onChange={(e) => setEditedEmployee({...editedEmployee, phone: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{employee.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedEmployee.email}
                          onChange={(e) => setEditedEmployee({...editedEmployee, email: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{employee.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      {isEditing ? (
                        <textarea
                          value={editedEmployee.address}
                          onChange={(e) => setEditedEmployee({...editedEmployee, address: e.target.value})}
                          rows={3}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{employee.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Average</p>
                      <p className="text-2xl font-bold text-green-600">{employee.attendanceRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Days Present (This Month)</p>
                      <p className="text-2xl font-bold text-blue-600">22</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Employment Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-medium text-gray-900">{employee.employeeId}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    {isEditing ? (
                      <select
                        value={editedEmployee.department}
                        onChange={(e) => setEditedEmployee({...editedEmployee, department: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Quality Control">Quality Control</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Safety">Safety</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Packaging">Packaging</option>
                        <option value="Administration">Administration</option>
                        <option value="Human Resources">Human Resources</option>
                      </select>
                    ) : (
                      <p className="font-medium text-gray-900">{employee.department}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedEmployee.role}
                        onChange={(e) => setEditedEmployee({...editedEmployee, role: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{employee.role}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedEmployee.joinDate}
                        onChange={(e) => setEditedEmployee({...editedEmployee, joinDate: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Employment Status</p>
                    {isEditing ? (
                      <select
                        value={editedEmployee.status}
                        onChange={(e) => setEditedEmployee({...editedEmployee, status: e.target.value as Employee['status']})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="On Probation">On Probation</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Resigned">Resigned</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payroll Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Payroll Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Base Salary</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedEmployee.salary}
                        onChange={(e) => setEditedEmployee({...editedEmployee, salary: parseInt(e.target.value)})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-medium text-gray-900">
                        ${employee.salary.toLocaleString()}/month
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Bank Account</p>
                    <p className="font-medium text-gray-900">{employee.bankAccount}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">EPF Eligible</p>
                      <p className="font-medium text-gray-900">{employee.epfEligible ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ETF Eligible</p>
                      <p className="font-medium text-gray-900">{employee.etfEligible ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div>
            {employee.status !== 'Resigned' && (
              <button
                onClick={handleDeactivate}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <UserX className="h-4 w-4" />
                <span>Deactivate Employee</span>
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setEditedEmployee(employee);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Employee</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;