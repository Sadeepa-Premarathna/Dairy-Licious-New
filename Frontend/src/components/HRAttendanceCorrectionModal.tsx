import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { AttendanceRecord, Employee } from '../data/mockData';

interface AttendanceCorrectionModalProps {
  record: AttendanceRecord;
  employee: Employee;
  onClose: () => void;
  onSave: (correctedRecord: AttendanceRecord) => void;
}

const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({
  record,
  employee,
  onClose,
  onSave
}) => {
  const [editedRecord, setEditedRecord] = useState<AttendanceRecord>(record);
  const [reason, setReason] = useState('');
  const [requiresApproval, setRequiresApproval] = useState(false);

  const handleSave = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for the correction');
      return;
    }

    const correctedRecord: AttendanceRecord = {
      ...editedRecord,
      correctionReason: reason,
      correctedBy: 'Alex Martinez', // Current HR Manager
      correctedAt: new Date().toISOString(),
      requiresApproval: requiresApproval
    };

    onSave(correctedRecord);
  };

  const calculateHours = (clockIn: string, clockOut: string) => {
    if (!clockIn || !clockOut) return 0;
    
    const inTime = new Date(`2000-01-01T${clockIn}`);
    const outTime = new Date(`2000-01-01T${clockOut}`);
    const diffMs = outTime.getTime() - inTime.getTime();
    
    return diffMs / (1000 * 60 * 60);
  };

  const isLateEntry = () => {
    if (!editedRecord.clockIn) return false;
    const clockInTime = new Date(`2000-01-01T${editedRecord.clockIn}`);
    const standardTime = new Date(`2000-01-01T08:00`); // 8:00 AM standard time
    return clockInTime > standardTime;
  };

  const isOvertime = () => {
    const hours = calculateHours(editedRecord.clockIn || '', editedRecord.clockOut || '');
    return hours > 8; // Standard 8-hour workday
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Attendance Correction</h2>
            <p className="text-gray-600 mt-1">
              {employee.name} - {new Date(record.date).toLocaleDateString()}
            </p>
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
          {/* Employee Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-medium">
                  {employee.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.employeeId} • {employee.department}</p>
                <p className="text-sm text-gray-600">{employee.role}</p>
              </div>
            </div>
          </div>

          {/* Original vs Corrected */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Original Record */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Original Record</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Clock In</label>
                  <p className="font-medium">{record.clockIn || 'Not recorded'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Clock Out</label>
                  <p className="font-medium">{record.clockOut || 'Not recorded'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <p className="font-medium">{record.status}</p>
                </div>
              </div>
            </div>

            {/* Corrected Record */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 className="font-semibold text-gray-900 mb-3">Corrected Record</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clock In</label>
                  <input
                    type="time"
                    value={editedRecord.clockIn || ''}
                    onChange={(e) => setEditedRecord({...editedRecord, clockIn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clock Out</label>
                  <input
                    type="time"
                    value={editedRecord.clockOut || ''}
                    onChange={(e) => setEditedRecord({...editedRecord, clockOut: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editedRecord.status}
                    onChange={(e) => setEditedRecord({...editedRecord, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Leave">Leave</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {(isLateEntry() || isOvertime()) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Attention Required</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    {isLateEntry() && <li>• Late entry detected (after 8:00 AM)</li>}
                    {isOvertime() && <li>• Overtime hours detected (over 8 hours)</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Correction Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Correction <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Please provide a detailed reason for this attendance correction..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Approval Required */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                This correction requires supervisor approval
              </span>
            </label>
          </div>

          {/* Summary */}
          {editedRecord.clockIn && editedRecord.clockOut && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="ml-2 font-medium">
                    {calculateHours(editedRecord.clockIn, editedRecord.clockOut).toFixed(1)}h
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-medium">{editedRecord.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Correction</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCorrectionModal;