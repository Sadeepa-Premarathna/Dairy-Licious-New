// Enhanced mock data service with comprehensive employee records
export interface DashboardData {
  kpis: {
    totalEmployees: number;
    newHires: number;
    resignations: number;
    payrollExpense: number;
    attendanceRate: number;
  };
  employeeGrowth: {
    months: string[];
    employeeCounts: number[];
  };
  attendanceTrend: {
    months: string[];
    attendanceRates: number[];
  };
  insights: {
    activeEmployees: number;
    departments: number;
    onLeave: number;
    newHiresThisWeek: number;
  };
  recentEmployees: Array<{
    id: string;
    name: string;
    role: string;
    status: 'Active' | 'Resigned' | 'On Leave';
    joinDate: string;
    department: string;
  }>;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  nic?: string;
  role: string;
  department: string;
  status: 'Active' | 'Resigned' | 'On Leave' | 'On Probation';
  joinDate: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  salary: number;
  bankAccount: string;
  epfEligible: boolean;
  etfEligible: boolean;
  attendanceRate: number;
  gender?: 'Male' | 'Female' | 'Other' | '';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD format
  clockIn: string | null; // HH:MM format
  clockOut: string | null; // HH:MM format
  status: 'Present' | 'Absent' | 'Late' | 'Leave';
  hoursWorked?: number;
  correctionReason?: string;
  correctedBy?: string;
  correctedAt?: string;
  requiresApproval?: boolean;
  uploadedBy?: string;
  uploadedAt?: string;
}

// Generate comprehensive employee records
export const getEmployeeRecords = (): Employee[] => {
  return [
    {
      id: '1',
      employeeId: 'DL001',
      name: 'Sarah Johnson',
      role: 'Quality Assurance Specialist',
      department: 'Quality Control',
      status: 'Active',
      joinDate: '2024-01-15',
      dateOfBirth: '1990-05-12',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@dairylicious.com',
      address: '123 Maple Street, Springfield, IL 62701',
      salary: 4500,
      bankAccount: '****-****-****-1234',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 96.5,
    },
    {
      id: '2',
      employeeId: 'DL002',
      name: 'Mike Chen',
      role: 'Production Supervisor',
      department: 'Manufacturing',
      status: 'Active',
      joinDate: '2024-01-10',
      dateOfBirth: '1985-08-22',
      phone: '+1 (555) 234-5678',
      email: 'mike.chen@dairylicious.com',
      address: '456 Oak Avenue, Springfield, IL 62702',
      salary: 5200,
      bankAccount: '****-****-****-2345',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 94.2,
    },
    {
      id: '3',
      employeeId: 'DL003',
      name: 'Emily Rodriguez',
      role: 'Food Safety Inspector',
      department: 'Safety',
      status: 'On Leave',
      joinDate: '2023-11-20',
      dateOfBirth: '1992-03-15',
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@dairylicious.com',
      address: '789 Pine Road, Springfield, IL 62703',
      salary: 4800,
      bankAccount: '****-****-****-3456',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 92.8,
    },
    {
      id: '4',
      employeeId: 'DL004',
      name: 'David Thompson',
      role: 'Maintenance Technician',
      department: 'Maintenance',
      status: 'Active',
      joinDate: '2024-01-08',
      dateOfBirth: '1988-11-30',
      phone: '+1 (555) 456-7890',
      email: 'david.thompson@dairylicious.com',
      address: '321 Elm Street, Springfield, IL 62704',
      salary: 4200,
      bankAccount: '****-****-****-4567',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 98.1,
    },
    {
      id: '5',
      employeeId: 'DL005',
      name: 'Lisa Anderson',
      role: 'Logistics Coordinator',
      department: 'Logistics',
      status: 'Resigned',
      joinDate: '2022-03-15',
      dateOfBirth: '1987-07-18',
      phone: '+1 (555) 567-8901',
      email: 'lisa.anderson@dairylicious.com',
      address: '654 Birch Lane, Springfield, IL 62705',
      salary: 4600,
      bankAccount: '****-****-****-5678',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 89.5,
    },
    {
      id: '6',
      employeeId: 'DL006',
      name: 'James Wilson',
      role: 'Packaging Operator',
      department: 'Packaging',
      status: 'Active',
      joinDate: '2024-01-12',
      dateOfBirth: '1993-09-25',
      phone: '+1 (555) 678-9012',
      email: 'james.wilson@dairylicious.com',
      address: '987 Cedar Drive, Springfield, IL 62706',
      salary: 3800,
      bankAccount: '****-****-****-6789',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 95.3,
    },
    {
      id: '7',
      employeeId: 'DL007',
      name: 'Maria Garcia',
      role: 'HR Specialist',
      department: 'Human Resources',
      status: 'Active',
      joinDate: '2023-09-01',
      dateOfBirth: '1991-12-08',
      phone: '+1 (555) 789-0123',
      email: 'maria.garcia@dairylicious.com',
      address: '147 Willow Way, Springfield, IL 62707',
      salary: 4700,
      bankAccount: '****-****-****-7890',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 97.2,
    },
    {
      id: '8',
      employeeId: 'DL008',
      name: 'Robert Kim',
      role: 'Process Engineer',
      department: 'Manufacturing',
      status: 'On Probation',
      joinDate: '2024-01-22',
      dateOfBirth: '1989-04-14',
      phone: '+1 (555) 890-1234',
      email: 'robert.kim@dairylicious.com',
      address: '258 Spruce Street, Springfield, IL 62708',
      salary: 5500,
      bankAccount: '****-****-****-8901',
      epfEligible: false,
      etfEligible: false,
      attendanceRate: 91.7,
    },
    {
      id: '9',
      employeeId: 'DL009',
      name: 'Jennifer Brown',
      role: 'Quality Control Analyst',
      department: 'Quality Control',
      status: 'Active',
      joinDate: '2023-06-15',
      dateOfBirth: '1994-01-20',
      phone: '+1 (555) 901-2345',
      email: 'jennifer.brown@dairylicious.com',
      address: '369 Poplar Place, Springfield, IL 62709',
      salary: 4300,
      bankAccount: '****-****-****-9012',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 93.8,
    },
    {
      id: '10',
      employeeId: 'DL010',
      name: 'Alex Martinez',
      role: 'HR Manager',
      department: 'Human Resources',
      status: 'Active',
      joinDate: '2021-08-10',
      dateOfBirth: '1983-06-05',
      phone: '+1 (555) 012-3456',
      email: 'alex.martinez@dairylicious.com',
      address: '741 Hickory Hill, Springfield, IL 62710',
      salary: 6500,
      bankAccount: '****-****-****-0123',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 98.5,
    },
    {
      id: '11',
      employeeId: 'DL011',
      name: 'Thomas Lee',
      role: 'Warehouse Supervisor',
      department: 'Logistics',
      status: 'Active',
      joinDate: '2023-04-03',
      dateOfBirth: '1986-10-12',
      phone: '+1 (555) 123-4567',
      email: 'thomas.lee@dairylicious.com',
      address: '852 Ash Avenue, Springfield, IL 62711',
      salary: 4900,
      bankAccount: '****-****-****-1234',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 96.1,
    },
    {
      id: '12',
      employeeId: 'DL012',
      name: 'Amanda Davis',
      role: 'Safety Officer',
      department: 'Safety',
      status: 'Active',
      joinDate: '2023-07-20',
      dateOfBirth: '1990-02-28',
      phone: '+1 (555) 234-5678',
      email: 'amanda.davis@dairylicious.com',
      address: '963 Chestnut Court, Springfield, IL 62712',
      salary: 5100,
      bankAccount: '****-****-****-2345',
      epfEligible: true,
      etfEligible: true,
      attendanceRate: 94.7,
    },
  ];
};

// Dashboard data with dynamic integration
export const getDashboardData = (): DashboardData => {
  const employees = getEmployeeRecords();
  const activeEmployees = employees.filter(emp => emp.status === 'Active');
  const resignedEmployees = employees.filter(emp => emp.status === 'Resigned');
  const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave');
  
  // Calculate new hires this month (January 2024)
  const newHiresThisMonth = employees.filter(emp => {
    const joinDate = new Date(emp.joinDate);
    const currentMonth = new Date('2024-01-01');
    return joinDate.getMonth() === currentMonth.getMonth() && 
           joinDate.getFullYear() === currentMonth.getFullYear();
  }).length;

  // Calculate total payroll expense
  const totalPayroll = activeEmployees.reduce((sum, emp) => sum + emp.salary, 0);

  // Calculate average attendance rate
  const avgAttendanceRate = activeEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / activeEmployees.length;

  // Get unique departments
  const departments = [...new Set(employees.map(emp => emp.department))];

  return {
    kpis: {
      totalEmployees: employees.length,
      newHires: newHiresThisMonth,
      resignations: resignedEmployees.length,
      payrollExpense: totalPayroll,
      attendanceRate: Math.round(avgAttendanceRate * 10) / 10,
    },
    employeeGrowth: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      employeeCounts: [220, 225, 228, 232, 235, 240, 242, 245, 246, 248, 250, 252],
    },
    attendanceTrend: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      attendanceRates: [92.5, 91.8, 93.2, 94.1, 95.3, 93.8, 92.9, 94.7, 95.1, 94.2, 93.6, 94.8],
    },
    insights: {
      activeEmployees: activeEmployees.length,
      departments: departments.length,
      onLeave: onLeaveEmployees.length,
      newHiresThisWeek: 3,
    },
    recentEmployees: employees.slice(0, 6).map(emp => ({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      status: emp.status as 'Active' | 'Resigned' | 'On Leave',
      joinDate: emp.joinDate,
      department: emp.department,
    })),
  };
};

// Generate attendance records
export const getAttendanceRecords = (): AttendanceRecord[] => {
  const employees = getEmployeeRecords();
  const records: AttendanceRecord[] = [];
  
  // Generate records for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    employees.forEach((employee, empIndex) => {
      if (employee.status !== 'Active') return;
      
      // Simulate some randomness in attendance
      const random = Math.random();
      let status: AttendanceRecord['status'] = 'Present';
      let clockIn: string | null = '08:00';
      let clockOut: string | null = '17:00';
      
      if (random < 0.05) { // 5% absent
        status = 'Absent';
        clockIn = null;
        clockOut = null;
      } else if (random < 0.15) { // 10% late
        status = 'Late';
        clockIn = '08:15';
      } else if (random < 0.20) { // 5% on leave
        status = 'Leave';
        clockIn = null;
        clockOut = null;
      }
      
      // Add some variation to clock times
      if (clockIn && status === 'Present') {
        const minutes = Math.floor(Math.random() * 30); // 0-30 minutes variation
        const hour = 8;
        clockIn = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      
      if (clockOut && (status === 'Present' || status === 'Late')) {
        const minutes = Math.floor(Math.random() * 60); // 0-60 minutes variation
        const hour = 17;
        clockOut = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      
      records.push({
        id: `att_${dateStr}_${employee.id}`,
        employeeId: employee.id,
        date: dateStr,
        clockIn,
        clockOut,
        status
      });
    });
  }
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};