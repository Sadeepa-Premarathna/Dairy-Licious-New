import React, { useState, useRef } from 'react';
import { X, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { AttendanceRecord, Employee } from '../data/mockData';

interface BulkUploadModalProps {
  onClose: () => void;
  onUpload: (records: AttendanceRecord[]) => void;
  employees: Employee[];
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ onClose, onUpload, employees }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setErrors(['Please upload a CSV file']);
      return;
    }

    setUploadedFile(file);
    setErrors([]);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    setIsProcessing(true);
    
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Expected headers
      const expectedHeaders = ['Employee ID', 'Date', 'Clock In', 'Clock Out', 'Status'];
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setErrors([`Missing required columns: ${missingHeaders.join(', ')}`]);
        setIsProcessing(false);
        return;
      }

      const data = [];
      const newErrors = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Validate row
        const employee = employees.find(emp => emp.employeeId === row['Employee ID']);
        if (!employee) {
          newErrors.push(`Row ${i + 1}: Employee ID "${row['Employee ID']}" not found`);
          continue;
        }

        if (!row['Date'] || !isValidDate(row['Date'])) {
          newErrors.push(`Row ${i + 1}: Invalid date format`);
          continue;
        }

        if (!['Present', 'Absent', 'Late', 'Leave'].includes(row['Status'])) {
          newErrors.push(`Row ${i + 1}: Invalid status "${row['Status']}"`);
          continue;
        }

        row.employeeName = employee.name;
        row.department = employee.department;
        data.push(row);
      }

      setPreviewData(data);
      setErrors(newErrors);
    } catch (error) {
      setErrors(['Error parsing CSV file. Please check the format.']);
    }
    
    setIsProcessing(false);
  };

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleUpload = () => {
    if (errors.length > 0) {
      alert('Please fix all errors before uploading');
      return;
    }

    const attendanceRecords: AttendanceRecord[] = previewData.map((row, index) => ({
      id: `bulk_${Date.now()}_${index}`,
      employeeId: employees.find(emp => emp.employeeId === row['Employee ID'])?.id || '',
      date: row['Date'],
      clockIn: row['Clock In'] || null,
      clockOut: row['Clock Out'] || null,
      status: row['Status'] as 'Present' | 'Absent' | 'Late' | 'Leave',
      uploadedBy: 'Alex Martinez',
      uploadedAt: new Date().toISOString()
    }));

    onUpload(attendanceRecords);
  };

  const downloadTemplate = () => {
    const headers = ['Employee ID', 'Date', 'Clock In', 'Clock Out', 'Status'];
    const sampleData = [
      ['DL001', '2024-01-15', '08:00', '17:00', 'Present'],
      ['DL002', '2024-01-15', '08:15', '17:00', 'Late'],
      ['DL003', '2024-01-15', '', '', 'Absent']
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Upload Attendance</h2>
            <p className="text-gray-600 mt-1">Upload attendance records from CSV file</p>
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
          {/* Template Download */}
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Need a template?</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Download our CSV template with the correct format and sample data
                  </p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Template</span>
                </button>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your CSV file here, or click to browse
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Supports CSV files up to 10MB
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          {/* File Info */}
          {uploadedFile && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setPreviewData([]);
                      setErrors([]);
                    }}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
            </div>
          )}

          {/* Preview Data */}
          {previewData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview ({previewData.length} records)
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Employee ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Clock In
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Clock Out
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {previewData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{row['Employee ID']}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{row.employeeName}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{row['Date']}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{row['Clock In'] || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{row['Clock Out'] || '-'}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{row['Status']}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.length > 10 && (
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
                    ... and {previewData.length - 10} more records
                  </div>
                )}
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
            onClick={handleUpload}
            disabled={previewData.length === 0 || errors.length > 0 || isProcessing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4" />
            <span>Upload {previewData.length} Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;