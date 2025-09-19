import React, { useState, useEffect } from 'react';
import { DollarSign, Users, PiggyBank, Wallet } from 'lucide-react';
import PayrollCard from './PayrollCard';
import PayrollModal from './PayrollModal';
import AllowanceManager from './AllowanceManager';
import { Employee, PayrollSummary, PayrollCardData } from '../types/payroll';
import { getEmployeeData, calculatePayrollSummary } from '../data/payrollData';

const PayrollDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch employee data
    const fetchPayrollData = async () => {
      try {
        // In real app, this would be an API call to HR system
        const employeeData = getEmployeeData();
        const summary = calculatePayrollSummary(employeeData);
        
        setEmployees(employeeData);
        setPayrollSummary(summary);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, []);

  const getCardData = (): PayrollCardData[] => {
    if (!payrollSummary) return [];

    return [
      {
        id: 'gross',
        title: 'Total Gross Salary',
        value: payrollSummary.totalGrossSalary,
        icon: <DollarSign size={24} className="text-white" />,
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        description: 'Combined gross salary for all employees including basic pay, overtime, and allowances'
      },
      {
        id: 'epfEmployee',
        title: 'Total EPF Employee Contributions',
        value: payrollSummary.totalEpfEmployee,
        icon: <Users size={24} className="text-white" />,
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        description: 'Employee contributions to EPF (8% of basic salary + overtime)'
      },
      {
        id: 'epfEtfEmployer',
        title: 'Total EPF & ETF Employer Contributions',
        value: payrollSummary.totalEpfEtfEmployer,
        icon: <PiggyBank size={24} className="text-white" />,
        color: 'bg-orange-600',
        bgColor: 'bg-orange-50',
        description: 'Employer contributions to EPF (12%) and ETF (3%) funds'
      },
      {
        id: 'net',
        title: 'Total Net Salary Paid',
        value: payrollSummary.totalNetSalary,
        icon: <Wallet size={24} className="text-white" />,
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        description: 'Final amount paid to employees after all deductions and contributions'
      }
    ];
  };

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const getModalData = () => {
    const cardData = getCardData().find(card => card.id === selectedCard);
    if (!cardData || !payrollSummary) return null;

    return {
      title: cardData.title,
      totalValue: cardData.value,
      dataType: selectedCard as 'gross' | 'epfEmployee' | 'epfEtfEmployer' | 'net'
    };
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading payroll data...</div>
        </div>
      </div>
    );
  }

  const cardData = getCardData();
  const modalData = getModalData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payroll Calculation Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of salary calculations and employee compensation details
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card) => (
          <PayrollCard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
            description={card.description}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payroll Summary Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {employees.length}
            </div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="text-sm text-gray-600">Current Pay Period</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {payrollSummary ? 
                new Intl.NumberFormat('en-LK', {
                  style: 'currency',
                  currency: 'LKR',
                  minimumFractionDigits: 0
                }).format(payrollSummary.totalGrossSalary / employees.length) 
                : 'LKR 0'
              }
            </div>
            <div className="text-sm text-gray-600">Average Gross Salary</div>
          </div>
        </div>
      </div>

      {/* Allowance Management Section */}
      <AllowanceManager />

      {/* Modal */}
      {selectedCard && modalData && (
        <PayrollModal
          isOpen={true}
          onClose={handleCloseModal}
          title={modalData.title}
          totalValue={modalData.totalValue}
          employees={employees}
          dataType={modalData.dataType}
        />
      )}
    </div>
  );
};

export default PayrollDashboard;