import React from 'react';
import KPICard from '../components/KPICard';
import EmployeeGrowthChart from '../components/EmployeeGrowthChart';
import AttendanceChart from '../components/AttendanceChart';
import EmployeeInsights from '../components/EmployeeInsights';
import RecentEmployeesTable from '../components/RecentEmployeesTable';
import { DashboardData } from '../data/mockData';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';

interface DashboardProps {
  data: DashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <KPICard
          title="Total Employees"
          value={data.kpis.totalEmployees}
          change={{ value: 2.1, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <KPICard
          title="New Hires (Month)"
          value={data.kpis.newHires}
          change={{ value: 15.3, type: 'increase' }}
          icon={UserPlus}
          color="green"
        />
        <KPICard
          title="Resignations"
          value={data.kpis.resignations}
          change={{ value: 25.0, type: 'decrease' }}
          icon={UserMinus}
          color="red"
        />
        <KPICard
          title="Payroll Expense"
          value={formatCurrency(data.kpis.payrollExpense)}
          change={{ value: 3.2, type: 'increase' }}
          icon={DollarSign}
          color="yellow"
        />
        <KPICard
          title="Attendance Rate"
          value={`${data.kpis.attendanceRate}%`}
          change={{ value: 1.8, type: 'increase' }}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <EmployeeGrowthChart data={data.employeeGrowth} />
        <AttendanceChart data={data.attendanceTrend} />
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <EmployeeInsights insights={data.insights} />
        </div>
        <div className="lg:col-span-2">
          <RecentEmployeesTable employees={data.recentEmployees} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;