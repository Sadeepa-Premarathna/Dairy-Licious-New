import React, { useState } from 'react';
import { Download, User, Mail, Phone, Calendar, DollarSign, Badge, Eye, FileText, X } from 'lucide-react';
import { useEmployee } from '../context/EMP_Dash_Context';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SalarySlipData {
  employee_id: string;
  name: string;
  designation: string;
  epf_no: string;
  month: string;
  working_days: number;
  ot_hours: number;
  bank_name: string;
  account_no: string;
  branch_name: string;
  basic_salary: number;
  allowances: {
    cost_of_living: number;
    food: number;
    conveyance: number;
    medical: number;
  };
  total_allowances: number;
  overtime: number;
  reimbursements: number;
  bonus: number;
  gross_salary: number;
  deductions: {
    no_pay_deductions: number;
    salary_advance: number;
    epf_employee: number;
    apit: number;
  };
  total_deductions: number;
  net_salary: number;
  amount_in_words: string;
  epf_employer: number;
  etf_employer: number;
  salary_before_deduction: number;
  leave_allowed: number;
  no_pay_leave: number;
  leave_taken: number;
}

const EMP_Dash_Board: React.FC = () => {
  const { employee, loading } = useEmployee();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [salarySlipData, setSalarySlipData] = useState<SalarySlipData | null>(null);
  const [fetchingSlip, setFetchingSlip] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleFetchSlip = async () => {
    if (!employee) {
      setError('Employee data not available');
      return;
    }

    setFetchingSlip(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/salary-slip/${employee.employee_id}?month=${selectedMonth}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch salary slip data');
      }
      
      const data = await response.json();
      setSalarySlipData(data);
      setShowPreview(true);
    } catch (error) {
      console.error('Error fetching salary slip:', error);
      setError('Failed to fetch salary slip. Please try again.');
      
      // Mock data for development
      const mockData: SalarySlipData = {
        employee_id: employee.employee_id,
        name: employee.name,
        designation: employee.role,
        epf_no: "85451/D/01",
        month: `2025-${String(selectedMonth + 1).padStart(2, '0')}`,
        working_days: 22,
        ot_hours: 15,
        bank_name: "Commercial Bank",
        account_no: "123456789",
        branch_name: "Colombo Branch",
        basic_salary: employee.basic_salary,
        allowances: {
          cost_of_living: 25000,
          food: 6000,
          conveyance: 3500,
          medical: 8000
        },
        total_allowances: 42500,
        overtime: 18750,
        reimbursements: 5000,
        bonus: 10000,
        gross_salary: employee.basic_salary + 42500,
        deductions: {
          no_pay_deductions: 0,
          salary_advance: 10000,
          epf_employee: Math.round(employee.basic_salary * 0.08),
          apit: 0
        },
        total_deductions: 10000 + Math.round(employee.basic_salary * 0.08),
        net_salary: employee.basic_salary + 42500 + 18750 + 5000 + 10000 - (10000 + Math.round(employee.basic_salary * 0.08)),
        amount_in_words: "LKR One Hundred Sixty-Three Thousand, Three Hundred Ten",
        epf_employer: Math.round(employee.basic_salary * 0.12),
        etf_employer: Math.round(employee.basic_salary * 0.03),
        salary_before_deduction: employee.basic_salary + 42500 + 18750 + 5000 + 10000,
        leave_allowed: 2,
        no_pay_leave: 0,
        leave_taken: 1
      };
      setSalarySlipData(mockData);
      setShowPreview(true);
    } finally {
      setFetchingSlip(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!salarySlipData) return;
    
    setDownloadingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      // Company Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Dairy Products Manufacturing Factory', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('123 Factory Road, Colombo 07, Sri Lanka', 105, 28, { align: 'center' });
      doc.text('Tel: +94 11 234 5678 | Email: info@dairyfactory.lk', 105, 35, { align: 'center' });
      
      // Title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const monthName = months[parseInt(salarySlipData.month.split('-')[1]) - 1];
      const year = salarySlipData.month.split('-')[0];
      doc.text(`Salary Slip For the Month: ${monthName}-${year.slice(-2)}`, 105, 50, { align: 'center' });
      
      // Employee Information Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Employee Information', 20, 70);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`UID: ${salarySlipData.employee_id}`, 20, 80);
      doc.text(`Designation: ${salarySlipData.designation}`, 120, 80);
      doc.text(`Name: ${salarySlipData.name}`, 20, 88);
      doc.text(`EPF No: ${salarySlipData.epf_no}`, 120, 88);
      
      // Employee Attendance and Bank Details
      doc.setFont('helvetica', 'bold');
      doc.text('Employee Attendance', 20, 105);
      doc.text('Salary Transferred To', 120, 105);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Working Days: ${salarySlipData.working_days}`, 20, 115);
      doc.text(`Overtime Hours: ${salarySlipData.ot_hours}`, 20, 123);
      doc.text(`Leave Allowed: ${salarySlipData.leave_allowed}`, 20, 131);
      doc.text(`Leave Taken: ${salarySlipData.leave_taken}`, 20, 139);
      doc.text(`No Pay Leave: ${salarySlipData.no_pay_leave}`, 20, 147);
      
      doc.text(`Bank Name: ${salarySlipData.bank_name}`, 120, 115);
      doc.text(`Account No: ${salarySlipData.account_no}`, 120, 123);
      doc.text(`Branch Name: ${salarySlipData.branch_name}`, 120, 131);
      
      // Salary Calculations Table
      doc.setFont('helvetica', 'bold');
      doc.text('Salary Calculations', 20, 165);
      
      // Earnings and Deductions Table
      autoTable(doc, {
        startY: 175,
        head: [['Earnings', 'Amount (LKR)', 'Deductions', 'Amount (LKR)']],
        body: [
          ['Basic Salary', salarySlipData.basic_salary.toLocaleString(), 'No Pay Days Deductions', salarySlipData.deductions.no_pay_deductions.toLocaleString()],
          ['', '', 'Salary Advance', salarySlipData.deductions.salary_advance.toLocaleString()],
          ['Allowances:', '', 'EPF Employee Contribution 8%', salarySlipData.deductions.epf_employee.toLocaleString()],
          ['Cost of Living Allowance', salarySlipData.allowances.cost_of_living.toLocaleString(), 'APIT', salarySlipData.deductions.apit.toLocaleString()],
          ['Food Allowance', salarySlipData.allowances.food.toLocaleString(), '', ''],
          ['Conveyance Allowance', salarySlipData.allowances.conveyance.toLocaleString(), 'Total Deductions', salarySlipData.total_deductions.toLocaleString()],
          ['Medical Allowance', salarySlipData.allowances.medical.toLocaleString(), '', ''],
          ['Total Allowances', salarySlipData.total_allowances.toLocaleString(), 'EPF Employer Contribution 12%', salarySlipData.epf_employer.toLocaleString()],
          ['Gross Salary', salarySlipData.gross_salary.toLocaleString(), 'ETF Employer Contribution 3%', salarySlipData.etf_employer.toLocaleString()],
          ['', '', '', ''],
          ['Additional Perks:', '', '', ''],
          ['Overtime', salarySlipData.overtime.toLocaleString(), '', ''],
          ['Reimbursements', salarySlipData.reimbursements.toLocaleString(), '', ''],
          ['Bonus', salarySlipData.bonus.toLocaleString(), '', ''],
          ['Salary Before Deduction', salarySlipData.salary_before_deduction.toLocaleString(), 'Net Payable Salary', salarySlipData.net_salary.toLocaleString()]
        ],
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 35, halign: 'right' },
          2: { cellWidth: 45 },
          3: { cellWidth: 35, halign: 'right' }
        }
      });
      
      // Amount in Words
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Amount in Words:', 20, finalY);
      doc.setFont('helvetica', 'normal');
      doc.text(salarySlipData.amount_in_words, 20, finalY + 8);
      
      // Signatures
      doc.setFont('helvetica', 'normal');
      doc.text('Prepared By: Accountant', 20, finalY + 25);
      doc.text('Approved By: HR Manager', 120, finalY + 25);
      
      // Footer
      doc.setFontSize(8);
      doc.text('This is a computer-generated document and does not require a signature.', 105, finalY + 40, { align: 'center' });
      
      // Save the PDF
      const fileName = `${salarySlipData.name.replace(/\s+/g, '_')}_${monthName}_${year}_SalarySlip.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>Unable to load employee details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Employee Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{employee.name}</h2>
            <p className="text-gray-600">{employee.role}</p>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              employee.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {employee.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Badge className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium text-gray-800">{employee.employee_id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{employee.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{employee.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-800">
                {format(new Date(employee.date_of_birth), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Basic Salary</p>
              <p className="font-medium text-gray-800">
                Rs. {employee.basic_salary.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">NIC</p>
              <p className="font-medium text-gray-800">{employee.nic}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Slip Download Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Download Salary Slip</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end mb-4">
          <div className="flex-1 min-w-0">
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(parseInt(e.target.value));
                setShowPreview(false);
                setSalarySlipData(null);
                setError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month} 2025
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleFetchSlip}
              disabled={fetchingSlip}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>{fetchingSlip ? 'Loading...' : 'Preview'}</span>
            </button>

            {salarySlipData && (
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="flex items-center space-x-2 px-6 py-2 bg-yellow-400 text-blue-900 rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Download className="h-4 w-4" />
                <span>{downloadingPDF ? 'Generating...' : 'Download PDF'}</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <p className="text-sm text-gray-500">
          Select a month and click "Preview" to view your salary slip details, then download as PDF.
        </p>
      </div>

      {/* Salary Slip Preview */}
      {showPreview && salarySlipData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Salary Slip Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Company Header */}
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold text-blue-900">Dairy Products Manufacturing Factory</h2>
              <p className="text-sm text-gray-600">123 Factory Road, Colombo 07, Sri Lanka</p>
              <p className="text-sm text-gray-600">Tel: +94 11 234 5678 | Email: info@dairyfactory.lk</p>
              <h3 className="text-lg font-semibold text-gray-800 mt-2">
                Salary Slip For the Month: {months[parseInt(salarySlipData.month.split('-')[1]) - 1]}-{salarySlipData.month.split('-')[0].slice(-2)}
              </h3>
            </div>

            {/* Employee Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Employee Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">UID:</span>
                    <span className="font-medium">{salarySlipData.employee_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{salarySlipData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Designation:</span>
                    <span className="font-medium">{salarySlipData.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">EPF No:</span>
                    <span className="font-medium">{salarySlipData.epf_no}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Bank Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Name:</span>
                    <span className="font-medium">{salarySlipData.bank_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account No:</span>
                    <span className="font-medium">{salarySlipData.account_no}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Branch:</span>
                    <span className="font-medium">{salarySlipData.branch_name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Details */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Employee Attendance</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-600">Working Days</p>
                  <p className="font-bold text-blue-900">{salarySlipData.working_days}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-gray-600">OT Hours</p>
                  <p className="font-bold text-yellow-600">{salarySlipData.ot_hours}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-gray-600">Leave Allowed</p>
                  <p className="font-bold text-green-600">{salarySlipData.leave_allowed}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-gray-600">Leave Taken</p>
                  <p className="font-bold text-orange-600">{salarySlipData.leave_taken}</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-gray-600">No Pay Leave</p>
                  <p className="font-bold text-red-600">{salarySlipData.no_pay_leave}</p>
                </div>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-green-700">Earnings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium">LKR {salarySlipData.basic_salary.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <p className="font-medium text-gray-700 mb-2">Allowances:</p>
                    <div className="pl-4 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost of Living</span>
                        <span>LKR {salarySlipData.allowances.cost_of_living.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Food</span>
                        <span>LKR {salarySlipData.allowances.food.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conveyance</span>
                        <span>LKR {salarySlipData.allowances.conveyance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Medical</span>
                        <span>LKR {salarySlipData.allowances.medical.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between py-1 border-t font-medium">
                    <span>Total Allowances</span>
                    <span>LKR {salarySlipData.total_allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 bg-green-50 px-2 rounded">
                    <span className="font-medium">Gross Salary</span>
                    <span className="font-bold text-green-700">LKR {salarySlipData.gross_salary.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-2">
                    <p className="font-medium text-gray-700 mb-2">Additional Perks:</p>
                    <div className="pl-4 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overtime</span>
                        <span>LKR {salarySlipData.overtime.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reimbursements</span>
                        <span>LKR {salarySlipData.reimbursements.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bonus</span>
                        <span>LKR {salarySlipData.bonus.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between py-1 bg-blue-50 px-2 rounded font-medium">
                    <span>Salary Before Deduction</span>
                    <span className="font-bold text-blue-700">LKR {salarySlipData.salary_before_deduction.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 text-red-700">Deductions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">No Pay Days Deductions</span>
                    <span className="font-medium">LKR {salarySlipData.deductions.no_pay_deductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Salary Advance</span>
                    <span className="font-medium">LKR {salarySlipData.deductions.salary_advance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">EPF Employee (8%)</span>
                    <span className="font-medium">LKR {salarySlipData.deductions.epf_employee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">APIT</span>
                    <span className="font-medium">LKR {salarySlipData.deductions.apit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t font-medium bg-red-50 px-2 rounded">
                    <span>Total Deductions</span>
                    <span className="font-bold text-red-700">LKR {salarySlipData.total_deductions.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-2 mt-4">
                    <p className="font-medium text-gray-700 mb-2">Employer Contributions:</p>
                    <div className="pl-4 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">EPF Employer (12%)</span>
                        <span>LKR {salarySlipData.epf_employer.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETF Employer (3%)</span>
                        <span>LKR {salarySlipData.etf_employer.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold">Net Payable Salary</h4>
                  <p className="text-blue-200 text-sm mt-1">{salarySlipData.amount_in_words}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-yellow-400">
                    LKR {salarySlipData.net_salary.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t pt-4">
              <div className="flex justify-between">
                <span>Prepared By: Accountant</span>
                <span>Approved By: HR Manager</span>
              </div>
              <p className="mt-2">This is a computer-generated document and does not require a signature.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EMP_Dash_Board;