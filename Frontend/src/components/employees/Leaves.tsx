import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit2, Save, X } from 'lucide-react';
import { useEmployee } from '../context/EMP_Dash_Context';
import { format } from 'date-fns';

interface LeaveRecord {
  leave_id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

interface LeaveFormData {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

const Leaves: React.FC = () => {
  const { employee } = useEmployee();
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<LeaveFormData>();

  const leaveTypes = ['Sick', 'Casual', 'Annual'];

  const startDate = watch('start_date');

  useEffect(() => {
    if (employee) {
      fetchLeaveRecords();
    }
  }, [employee]);

  const fetchLeaveRecords = async () => {
    if (!employee) return;
    
    try {
      const response = await fetch(`/api/leaves/${employee.employee_id}`);
      if (response.ok) {
        const records = await response.json();
        setLeaveRecords(records);
      } else {
        // Mock data for development
        setLeaveRecords([
          {
            leave_id: 'LV001',
            employee_id: employee.employee_id,
            leave_type: 'Sick',
            start_date: '2025-01-15',
            end_date: '2025-01-17',
            reason: 'Medical checkup',
            status: 'Approved'
          },
          {
            leave_id: 'LV002',
            employee_id: employee.employee_id,
            leave_type: 'Casual',
            start_date: '2025-02-10',
            end_date: '2025-02-11',
            reason: 'Personal work',
            status: 'Pending'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching leave records:', error);
    }
  };

  const onSubmit = async (data: LeaveFormData) => {
    if (!employee) return;
    
    setLoading(true);
    try {
      const payload = {
        employee_id: employee.employee_id,
        ...data,
        status: 'Pending'
      };

      const response = await fetch('/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setLeaveRecords([...leaveRecords, newRecord]);
        reset();
        alert('Leave application submitted successfully!');
      } else {
        throw new Error('Failed to submit leave application');
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      // Mock success for development
      const newRecord: LeaveRecord = {
        leave_id: `LV${Date.now()}`,
        employee_id: employee.employee_id,
        ...data,
        status: 'Pending'
      };
      setLeaveRecords([...leaveRecords, newRecord]);
      reset();
      alert('Leave application submitted successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: LeaveRecord) => {
    setEditingRecord(record.leave_id);
    setValue('leave_type', record.leave_type);
    setValue('start_date', record.start_date);
    setValue('end_date', record.end_date);
    setValue('reason', record.reason);
  };

  const handleUpdate = async (data: LeaveFormData) => {
    if (!editingRecord) return;
    
    try {
      const response = await fetch(`/api/leaves/${editingRecord}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setLeaveRecords(leaveRecords.map(record => 
          record.leave_id === editingRecord ? updatedRecord : record
        ));
        setEditingRecord(null);
        reset();
        alert('Leave application updated successfully!');
      } else {
        throw new Error('Failed to update leave application');
      }
    } catch (error) {
      console.error('Error updating leave:', error);
      // Mock update for development
      setLeaveRecords(leaveRecords.map(record => 
        record.leave_id === editingRecord 
          ? { ...record, ...data }
          : record
      ));
      setEditingRecord(null);
      reset();
      alert('Leave application updated successfully!');
    }
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    reset();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
        statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Apply for Leave</h1>

      {/* Leave Application Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingRecord ? 'Update Leave Application' : 'Submit Leave Application'}
        </h3>
        
        <form onSubmit={handleSubmit(editingRecord ? handleUpdate : onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700 mb-1">
                Leave Type *
              </label>
              <select
                {...register('leave_type', { required: 'Leave type is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.leave_type && (
                <p className="text-red-500 text-sm mt-1">{errors.leave_type.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                {...register('start_date', { required: 'Start date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                {...register('end_date', { 
                  required: 'End date is required',
                  validate: (value) => {
                    if (startDate && value <= startDate) {
                      return 'End date must be after start date';
                    }
                    return true;
                  }
                })}
                min={startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason *
            </label>
            <textarea
              {...register('reason', { 
                required: 'Reason is required',
                minLength: { value: 10, message: 'Reason must be at least 10 characters' }
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide a detailed reason for your leave..."
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Submitting...' : editingRecord ? 'Update' : 'Submit'}</span>
            </button>
            
            {editingRecord && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Leave Records Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Leave Applications</h3>
        
        {leaveRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No leave applications found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Leave Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Start Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">End Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRecords.map((record) => (
                  <tr key={record.leave_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{record.leave_type}</td>
                    <td className="py-3 px-4 text-gray-800">
                      {format(new Date(record.start_date), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {format(new Date(record.end_date), 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 px-4 text-gray-800 max-w-xs truncate">
                      {record.reason}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(record)}
                        disabled={record.status !== 'Pending'}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={record.status !== 'Pending' ? 'Cannot edit approved/rejected applications' : 'Edit'}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaves;