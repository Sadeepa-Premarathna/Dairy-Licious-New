import React, { useState } from 'react';
import { FileText, Download, Loader2, BarChart3, Users } from 'lucide-react';
import { ReportFilters, PayrollReportData, PerformanceReportData, ReportMetadata } from '../types/reports';
import { reportService } from '../services/reportService';
import ReportPreview from './ReportPreview';
import Button from './ui/Button';
import Select from './ui/Select';
import Toast from './ui/Toast';

// Import for PDF generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

const ReportGeneration: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    timePeriod: 'Monthly',
    reportType: 'Payroll'
  });
  
  const [payrollData, setPayrollData] = useState<PayrollReportData | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const timePeriodOptions = [
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' }
  ];

  const reportTypeOptions = [
    { value: 'Payroll', label: 'Payroll' },
    { value: 'Performance', label: 'Performance' }
  ];

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const generateReport = async () => {
    setLoading(true);
    setHasGenerated(false);
    
    try {
      if (filters.reportType === 'Payroll') {
        const data = await reportService.generatePayrollReport(filters);
        setPayrollData(data);
        setPerformanceData(null);
      } else {
        const data = await reportService.generatePerformanceReport(filters);
        setPerformanceData(data);
        setPayrollData(null);
      }
      
      setHasGenerated(true);
      showToast('Report generated successfully', 'success');
    } catch (error) {
      showToast('Failed to generate report', 'error');
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReportMetadata = (): ReportMetadata => {
    const now = new Date();
    const currentData = filters.reportType === 'Payroll' ? payrollData : performanceData;
    
    return {
      companyName: 'DairyLicious',
      reportTitle: `${filters.reportType} Report`,
      timePeriod: currentData?.periodLabel || filters.timePeriod,
      generatedDate: now.toLocaleDateString(),
      generatedTime: now.toLocaleTimeString()
    };
  };

  const getFileName = (extension: string): string => {
    const metadata = getReportMetadata();
    const sanitizedPeriod = metadata.timePeriod.replace(/[^a-zA-Z0-9]/g, '_');
    return `${metadata.companyName}_${filters.reportType}_${sanitizedPeriod}.${extension}`;
  };

  const exportToPDF = async () => {
    if (!hasGenerated) return;
    
    setExporting(true);
    
    try {
      const element = document.getElementById('report-preview');
      if (!element) throw new Error('Report preview not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(getFileName('pdf'));
      showToast('PDF exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export PDF', 'error');
      console.error('Error exporting PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = () => {
    if (!hasGenerated) return;
    
    setExporting(true);
    
    try {
      const metadata = getReportMetadata();
      const workbook = XLSX.utils.book_new();
      
      if (filters.reportType === 'Payroll' && payrollData) {
        const data = [
          ['DairyLicious - Payroll Report'],
          [`Period: ${metadata.timePeriod}`],
          [`Generated: ${metadata.generatedDate} at ${metadata.generatedTime}`],
          [],
          ['Metric', 'Amount'],
          ['Total Gross Salary', payrollData.totalGrossSalary],
          ['EPF Employee Contributions', payrollData.totalEpfEmployee],
          ['EPF Employer Contributions', payrollData.totalEpfEmployer],
          ['ETF Employer Contributions', payrollData.totalEtfEmployer],
          ['Total Net Salary', payrollData.totalNetSalary],
          [],
          ['Summary'],
          ['Total Employees', payrollData.totalEmployees],
          ['Average Gross Salary', payrollData.totalGrossSalary / payrollData.totalEmployees],
          ['Average Net Salary', payrollData.totalNetSalary / payrollData.totalEmployees]
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Payroll Report');
      } else if (filters.reportType === 'Performance' && performanceData) {
        const data = [
          ['DairyLicious - Performance Report'],
          [`Period: ${metadata.timePeriod}`],
          [`Generated: ${metadata.generatedDate} at ${metadata.generatedTime}`],
          [],
          ['Metric', 'Amount'],
          ['Total Revenue', performanceData.totalRevenue],
          ['Total Expenses', performanceData.totalExpenses],
          ['Net Profit', performanceData.totalProfit],
          ['Profit Margin (%)', performanceData.profitMargin],
          [],
          ['Expense Breakdown'],
          ['Salaries', performanceData.expenseBreakdown.salaries],
          ['Milk Purchases', performanceData.expenseBreakdown.milkPurchases],
          ['Additional Expenses', performanceData.expenseBreakdown.additionalExpenses]
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance Report');
      }
      
      XLSX.writeFile(workbook, getFileName('xlsx'));
      showToast('Excel file exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export Excel file', 'error');
      console.error('Error exporting Excel:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Report Generation
        </h1>
        <p className="text-gray-600">
          Generate professional reports for payroll and performance analysis
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Time Period"
            options={timePeriodOptions}
            value={filters.timePeriod}
            onChange={(e) => setFilters(prev => ({ ...prev, timePeriod: e.target.value as ReportFilters['timePeriod'] }))}
          />
          
          <Select
            label="Report Type"
            options={reportTypeOptions}
            value={filters.reportType}
            onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value as ReportFilters['reportType'] }))}
          />
          
          <div className="flex items-end">
            <Button 
              onClick={generateReport} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Report Type Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            {filters.reportType === 'Payroll' ? (
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
            ) : (
              <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
            )}
            <div>
              <h3 className="font-medium text-gray-800 mb-1">
                {filters.reportType} Report
              </h3>
              <p className="text-sm text-gray-600">
                {filters.reportType === 'Payroll' 
                  ? 'Comprehensive payroll summary including gross salaries, EPF/ETF contributions, and net payments for all employees.'
                  : 'Financial performance overview including revenue, expenses, profit margins, and expense breakdowns by category.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {hasGenerated && (payrollData || performanceData) && (
        <>
          <ReportPreview
            reportType={filters.reportType}
            payrollData={payrollData}
            performanceData={performanceData}
            metadata={getReportMetadata()}
          />

          {/* Export Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Button 
                onClick={exportToPDF}
                disabled={exporting}
                variant="outline"
                className="flex-1"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Export PDF
              </Button>
              
              <Button 
                onClick={exportToExcel}
                disabled={exporting}
                variant="outline"
                className="flex-1"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export Excel
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Report generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </>
      )}

      {/* Empty State */}
      {!hasGenerated && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Report Generated</h3>
          <p className="text-gray-600 mb-4">
            Select your preferred time period and report type, then click "Generate Report" to create a professional report.
          </p>
        </div>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default ReportGeneration;