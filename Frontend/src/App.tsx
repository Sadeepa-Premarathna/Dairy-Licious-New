import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavigation from './components/TopNavigation';
import Dashboard from './pages/Dashboard';
import EmployeeRecords from './pages/EmployeeRecords';
import AttendanceTracking from './pages/AttendanceTracking';
import PayrollManagement from './pages/PayrollManagement';
import LeaveManagement from './pages/LeaveManagement';
import Reports from './pages/Reports';
import { getDashboardData, getAttendanceRecords, DashboardData, Employee, AttendanceRecord } from './data/mockData';

function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [payrollExpense, setPayrollExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dashData = getDashboardData();
        // Fetch employees from backend API
        const res = await fetch('http://localhost:8000/api/employees');
        const apiEmployees = await res.json();
        const empData: Employee[] = Array.isArray(apiEmployees) ? apiEmployees.map((e: any): Employee => ({
          id: e.id ?? e._id ?? crypto.randomUUID(),
          employeeId: e.employee_id ?? e.employeeId ?? '',
          name: e.name ?? '',
          nic: e.NIC ?? e.nic ?? '',
          role: e.role ?? '',
          department: e.department ?? (e.department === undefined ? '' : e.department),
          status: (e.status ?? 'Active') as Employee['status'],
          joinDate: (e.join_date ? new Date(e.join_date).toISOString().slice(0,10) : ''),
          dateOfBirth: (e.date_of_birth ? new Date(e.date_of_birth).toISOString().slice(0,10) : ''),
          phone: e.phone ?? '',
          email: e.email ?? '',
          address: e.address ?? '',
          salary: Number(e.basic_salary ?? 0),
          bankAccount: '',
          epfEligible: false,
          etfEligible: false,
          attendanceRate: 0,
          gender: e.gender ?? '',
        })) : [];
        const attData = getAttendanceRecords();
        setDashboardData(dashData);
        setEmployees(empData);
        setAttendanceRecords(attData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
    
    // Update dashboard data when employee data changes
    if (dashboardData) {
      const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
      const resignedEmployees = employees.filter(emp => emp.status === 'Resigned').length;
      
      setDashboardData({
        ...dashboardData,
        kpis: {
          ...dashboardData.kpis,
          totalEmployees: employees.length,
          resignations: resignedEmployees,
        },
        insights: {
          ...dashboardData.insights,
          activeEmployees: activeEmployees,
        }
      });
    }
  };

  const handleAttendanceUpdate = (updatedRecords: AttendanceRecord[]) => {
    setAttendanceRecords(updatedRecords);
    
    // Update dashboard attendance rate
    if (dashboardData) {
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = updatedRecords.filter(record => record.date === today);
      const presentCount = todayRecords.filter(record => record.status === 'Present' || record.status === 'Late').length;
      const totalCount = todayRecords.length;
      const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
      
      setDashboardData({
        ...dashboardData,
        kpis: {
          ...dashboardData.kpis,
          attendanceRate: Math.round(attendanceRate * 10) / 10,
        }
      });
    }
  };

  const handlePayrollUpdate = (totalExpense: number) => {
    setPayrollExpense(totalExpense);
    
    // Update dashboard data with new payroll expense
    if (dashboardData) {
      setDashboardData({
        ...dashboardData,
        kpis: {
          ...dashboardData.kpis,
          payrollExpense: totalExpense,
        }
      });
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HR Management System...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return <Dashboard data={dashboardData} />;
      case 'employees':
        return <EmployeeRecords employees={employees} onEmployeeUpdate={handleEmployeeUpdate} onEmployeeCreate={(employee) => {
          setEmployees(prev => [employee, ...prev]);
          if (dashboardData) {
            setDashboardData({
              ...dashboardData,
              kpis: {
                ...dashboardData.kpis,
                totalEmployees: employees.length + 1,
              },
              insights: {
                ...dashboardData.insights,
                activeEmployees: employees.filter(e => e.status === 'Active').length + (employee.status === 'Active' ? 1 : 0),
              }
            });
          }
        }} />;
      case 'attendance':
        return <AttendanceTracking employees={employees} attendanceRecords={attendanceRecords} onAttendanceUpdate={handleAttendanceUpdate} />;
      case 'payroll':
        return <PayrollManagement employees={employees} attendanceRecords={attendanceRecords} onPayrollUpdate={handlePayrollUpdate} />;
      case 'leaves':
        return <LeaveManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard data={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        activeItem={activeMenuItem} 
        onItemClick={handleMenuItemClick} 
      />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation 
          managerName="Alex Martinez" 
          notificationCount={5} 
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;