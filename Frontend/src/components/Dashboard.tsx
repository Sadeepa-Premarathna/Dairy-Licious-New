import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Milk, Users, Plus } from 'lucide-react';
import FinancialCard from './FinancialCard';
import ExpenseCard from './ExpenseCard';
import RevenueChart from './RevenueChart';
import TransactionsTable from './TransactionsTable';
import { 
  getFinancialOverview, 
  getMonthlyData, 
  getCurrentMonthExpenses, 
  getRecentTransactions 
} from '../data/mockData';
import { FinancialData, MonthlyData, ExpenseBreakdown, Transaction } from '../types';

const Dashboard: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expenses, setExpenses] = useState<ExpenseBreakdown | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls to various components
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be API calls to different components
        const [financial, monthly, currentExpenses, recentTransactions] = await Promise.all([
          Promise.resolve(getFinancialOverview()),
          Promise.resolve(getMonthlyData()),
          Promise.resolve(getCurrentMonthExpenses()),
          Promise.resolve(getRecentTransactions())
        ]);

        setFinancialData(financial);
        setMonthlyData(monthly);
        setExpenses(currentExpenses);
        setTransactions(recentTransactions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="ml-64 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FinancialCard
          title="Total Revenue"
          amount={financialData?.totalRevenue || 0}
          change={8.2}
          changeType="positive"
          icon={<DollarSign size={24} />}
          color="yellow"
        />
        <FinancialCard
          title="Total Expenses"
          amount={financialData?.totalExpenses || 0}
          change={-3.1}
          changeType="negative"
          icon={<TrendingDown size={24} />}
          color="blue"
        />
        <FinancialCard
          title="Net Profit"
          amount={financialData?.profit || 0}
          change={12.5}
          changeType="positive"
          icon={<TrendingUp size={24} />}
          color="green"
        />
      </div>

      {/* Revenue Chart */}
      <div className="mb-6">
        <RevenueChart data={monthlyData} />
      </div>

      {/* Bottom Section - Expenses and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Expenses */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Expenses</h3>
          <div className="space-y-4">
            <ExpenseCard
              title="Milk Purchase"
              amount={expenses?.milkPurchase || 0}
              icon={<Milk size={20} />}
              description="Raw milk procurement from local farms"
            />
            <ExpenseCard
              title="Salaries"
              amount={expenses?.salaries || 0}
              icon={<Users size={20} />}
              description="Employee wages including overtime"
            />
            <ExpenseCard
              title="Additional Expenses"
              amount={expenses?.additionalExpenses || 0}
              icon={<Plus size={20} />}
              description="Utilities, maintenance, and other costs"
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <TransactionsTable transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;