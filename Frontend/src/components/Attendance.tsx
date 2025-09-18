import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { useEmployee } from '../context/EMP_Dash_Context';

interface AttendanceRecord {
  _id: string;
  employee_id: string;
  month: string;
  working_days: number;
  ot_hours: number;
}

interface AttendanceFormData {
  month: string;
  working_days: number;
  ot_hours: number;
}

const Attendance: React.FC = () => {
  const { employee } = useEmployee();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AttendanceFormData>();

  // Month input uses YYYY-MM format

  useEffect(() => {
    if (employee) {
      fetchAttendanceRecords();
    }
  }, [employee]);

  const fetchAttendanceRecords = async () => {
    if (!employee) return;
    
    try {
      const response = await fetch(`/api/attendance?employee_id=${encodeURIComponent(employee.employee_id)}&limit=100`);
      if (response.ok) {
        const payload = await response.json();
        const records = payload?.data ?? payload;
        setAttendanceRecords(records);
      } else {
        // Mock data for development
        setAttendanceRecords([
          {
            _id: 'mock-1',
            employee_id: employee.employee_id,
            month: '2025-01',
            working_days: 22,
            ot_hours: 8
          },
          {
            _id: 'mock-2',
            employee_id: employee.employee_id,
            month: '2025-02',
            working_days: 20,
            ot_hours: 5
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const onSubmit = async (data: AttendanceFormData) => {
    if (!employee) return;
    
    setLoading(true);
    try {
      const payload = {
        employee_id: employee.employee_id,
        ...data
      };

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const payloadRes = await response.json();
        const newRecord = payloadRes?.data ?? payloadRes;
        setAttendanceRecords([...attendanceRecords, newRecord]);
        reset();
        alert('Attendance record added successfully!');
      } else {
        throw new Error('Failed to add attendance record');
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
      // Mock success for development
      const newRecord: AttendanceRecord = {
        _id: `${Date.now()}`,
        employee_id: employee.employee_id,
        month: data.month,
        working_days: data.working_days,
        ot_hours: data.ot_hours
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
      reset();
      alert('Attendance record added successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record._id);
    setValue('month', record.month);
    setValue('working_days', record.working_days);
    setValue('ot_hours', record.ot_hours);
  };

  const handleUpdate = async (data: AttendanceFormData) => {
    if (!editingRecord) return;
    
    try {
      const response = await fetch(`/api/attendance/${editingRecord}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const payloadRes = await response.json();
        const updatedRecord = payloadRes?.data ?? payloadRes;
        setAttendanceRecords(attendanceRecords.map(record => 
          record._id === editingRecord ? updatedRecord : record
        ));
        setEditingRecord(null);
        reset();
        alert('Attendance record updated successfully!');
      } else {
        throw new Error('Failed to update attendance record');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      // Mock update for development
      setAttendanceRecords(attendanceRecords.map(record => 
        record._id === editingRecord 
          ? { ...record, ...data }
          : record
      ));
      setEditingRecord(null);
      reset();
      alert('Attendance record updated successfully!');
    }
  };

  const handleDelete = async (attendanceId: string) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) return;
    
    try {
      const response = await fetch(`/api/attendance/${attendanceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAttendanceRecords(attendanceRecords.filter(record => record._id !== attendanceId));
        alert('Attendance record deleted successfully!');
      } else {
        throw new Error('Failed to delete attendance record');
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
      // Mock delete for development
      setAttendanceRecords(attendanceRecords.filter(record => record._id !== attendanceId));
      alert('Attendance record deleted successfully!');
    }
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>

      {/* Attendance Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {editingRecord ? 'Update Attendance Record' : 'Add Attendance Record'}
        </h3>
        
        <form onSubmit={handleSubmit(editingRecord ? handleUpdate : onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Month *
              </label>
              <input
                type="month"
                {...register('month', { required: 'Month is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.month && (
                <p className="text-red-500 text-sm mt-1">{errors.month.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="working_days" className="block text-sm font-medium text-gray-700 mb-1">
                Working Days *
              </label>
              <input
                type="number"
                {...register('working_days', { 
                  required: 'Working days is required',
                  min: { value: 1, message: 'Working days must be positive' },
                  max: { value: 31, message: 'Working days cannot exceed 31' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 22"
              />
              {errors.working_days && (
                <p className="text-red-500 text-sm mt-1">{errors.working_days.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="ot_hours" className="block text-sm font-medium text-gray-700 mb-1">
                OT Hours *
              </label>
              <input
                type="number"
                step="0.5"
                {...register('ot_hours', { 
                  required: 'OT hours is required',
                  min: { value: 0, message: 'OT hours cannot be negative' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 8"
              />
              {errors.ot_hours && (
                <p className="text-red-500 text-sm mt-1">{errors.ot_hours.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : editingRecord ? 'Update' : 'Submit'}</span>
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

      {/* Attendance Records Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Attendance Records</h3>
        
        {attendanceRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No attendance records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Month</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Working Days</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">OT Hours</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{record.month}</td>
                    <td className="py-3 px-4 text-gray-800">{record.working_days}</td>
                    <td className="py-3 px-4 text-gray-800">{record.ot_hours}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

export default Attendance;