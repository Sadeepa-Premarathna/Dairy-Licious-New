import { 
  RevenueRecord, 
  SalaryRecord, 
  MilkPurchaseRecord, 
  AdditionalExpenseRecord,
  ExpenseCategory 
} from '../types/revenue';

// Mock revenue data - would come from Inventory Manager
export const getRevenueData = (): RevenueRecord[] => {
  return [
    {
      id: 'REV001',
      date: '2025-01-15',
      orderId: 'ORD-2025-001',
      productCategory: 'Fresh Milk',
      customerName: 'SuperMart Ltd.',
      amount: 15750.00,
      status: 'Completed'
    },
    {
      id: 'REV002',
      date: '2025-01-14',
      orderId: 'ORD-2025-002',
      productCategory: 'Cheese Products',
      customerName: 'FreshMilk Co.',
      amount: 28900.00,
      status: 'Completed'
    },
    {
      id: 'REV003',
      date: '2025-01-13',
      orderId: 'ORD-2025-003',
      productCategory: 'Yogurt',
      customerName: 'Dairy Delights Inc.',
      amount: 12300.00,
      status: 'Completed'
    },
    {
      id: 'REV004',
      date: '2025-01-12',
      orderId: 'ORD-2025-004',
      productCategory: 'Butter',
      customerName: 'Pure Valley Foods',
      amount: 31200.00,
      status: 'Completed'
    },
    {
      id: 'REV005',
      date: '2025-01-11',
      orderId: 'ORD-2025-005',
      productCategory: 'Fresh Milk',
      customerName: 'Golden Dairy Ltd.',
      amount: 22450.00,
      status: 'Completed'
    },
    {
      id: 'REV006',
      date: '2025-01-10',
      orderId: 'ORD-2025-006',
      productCategory: 'Ice Cream',
      customerName: 'Sweet Treats Inc.',
      amount: 18750.00,
      status: 'Completed'
    },
    {
      id: 'REV007',
      date: '2025-01-09',
      orderId: 'ORD-2025-007',
      productCategory: 'Cheese Products',
      customerName: 'Gourmet Foods Ltd.',
      amount: 45600.00,
      status: 'Completed'
    },
    {
      id: 'REV008',
      date: '2025-01-08',
      orderId: 'ORD-2025-008',
      productCategory: 'Yogurt',
      customerName: 'Health Plus Markets',
      amount: 19850.00,
      status: 'Completed'
    }
  ];
};

// Mock salary data - would come from HR Manager
export const getSalaryData = (): SalaryRecord[] => {
  return [
    {
      id: 'SAL001',
      employeeName: 'John Anderson',
      employeeId: 'EMP001',
      basicSalary: 75000,
      otAmount: 12500,
      allowances: 8000,
      deductions: 2500,
      netSalary: 93000,
      payDate: '2025-01-31'
    },
    {
      id: 'SAL002',
      employeeName: 'Sarah Mitchell',
      employeeId: 'EMP002',
      basicSalary: 85000,
      otAmount: 15000,
      allowances: 10000,
      deductions: 3000,
      netSalary: 107000,
      payDate: '2025-01-31'
    },
    {
      id: 'SAL003',
      employeeName: 'Michael Chen',
      employeeId: 'EMP003',
      basicSalary: 65000,
      otAmount: 8000,
      allowances: 6000,
      deductions: 1500,
      netSalary: 77500,
      payDate: '2025-01-31'
    },
    {
      id: 'SAL004',
      employeeName: 'Emma Thompson',
      employeeId: 'EMP004',
      basicSalary: 95000,
      otAmount: 18000,
      allowances: 12000,
      deductions: 4000,
      netSalary: 121000,
      payDate: '2025-01-31'
    },
    {
      id: 'SAL005',
      employeeName: 'Robert Wilson',
      employeeId: 'EMP005',
      basicSalary: 70000,
      otAmount: 10000,
      allowances: 7000,
      deductions: 2000,
      netSalary: 85000,
      payDate: '2025-01-31'
    }
  ];
};

// Mock milk purchase data - would come from Collection & Distribution Manager
export const getMilkPurchaseData = (): MilkPurchaseRecord[] => {
  return [
    {
      id: 'MILK001',
      supplierName: 'Green Valley Farm',
      date: '2025-01-15',
      quantity: 2500,
      pricePerLiter: 1.25,
      totalAmount: 3125.00,
      qualityGrade: 'Grade A'
    },
    {
      id: 'MILK002',
      supplierName: 'Sunrise Dairy Farm',
      date: '2025-01-14',
      quantity: 3200,
      pricePerLiter: 1.30,
      totalAmount: 4160.00,
      qualityGrade: 'Grade A'
    },
    {
      id: 'MILK003',
      supplierName: 'Mountain View Ranch',
      date: '2025-01-13',
      quantity: 1800,
      pricePerLiter: 1.20,
      totalAmount: 2160.00,
      qualityGrade: 'Grade B'
    },
    {
      id: 'MILK004',
      supplierName: 'Fresh Meadows Farm',
      date: '2025-01-12',
      quantity: 2800,
      pricePerLiter: 1.28,
      totalAmount: 3584.00,
      qualityGrade: 'Grade A'
    },
    {
      id: 'MILK005',
      supplierName: 'Golden Fields Dairy',
      date: '2025-01-11',
      quantity: 2200,
      pricePerLiter: 1.22,
      totalAmount: 2684.00,
      qualityGrade: 'Grade A'
    }
  ];
};

// Mock additional expenses data - would come from Finance Manager forms
export const getAdditionalExpenseData = (): AdditionalExpenseRecord[] => {
  return [
    {
      id: 'ADD001',
      category: 'Utilities',
      description: 'Monthly electricity bill for production facility',
      amount: 8500.00,
      date: '2025-01-15',
      approvedBy: 'Sarah Johnson',
      status: 'Approved'
    },
    {
      id: 'ADD002',
      category: 'Maintenance',
      description: 'Equipment maintenance and repairs',
      amount: 12300.00,
      date: '2025-01-12',
      approvedBy: 'Sarah Johnson',
      status: 'Approved'
    },
    {
      id: 'ADD003',
      category: 'Transportation',
      description: 'Fuel and vehicle maintenance costs',
      amount: 4200.00,
      date: '2025-01-10',
      approvedBy: 'Sarah Johnson',
      status: 'Approved'
    },
    {
      id: 'ADD004',
      category: 'Supplies',
      description: 'Packaging materials and cleaning supplies',
      amount: 6800.00,
      date: '2025-01-08',
      approvedBy: 'Sarah Johnson',
      status: 'Approved'
    },
    {
      id: 'ADD005',
      category: 'Insurance',
      description: 'Monthly insurance premium',
      amount: 3500.00,
      date: '2025-01-05',
      approvedBy: 'Sarah Johnson',
      status: 'Approved'
    }
  ];
};

// Calculate totals
export const calculateTotals = () => {
  const revenueData = getRevenueData();
  const salaryData = getSalaryData();
  const milkData = getMilkPurchaseData();
  const additionalData = getAdditionalExpenseData();

  const totalRevenue = revenueData.reduce((sum, record) => sum + record.amount, 0);
  const totalSalaries = salaryData.reduce((sum, record) => sum + record.netSalary, 0);
  const totalMilkPurchases = milkData.reduce((sum, record) => sum + record.totalAmount, 0);
  const totalAdditionalExpenses = additionalData.reduce((sum, record) => sum + record.amount, 0);
  const totalExpenses = totalSalaries + totalMilkPurchases + totalAdditionalExpenses;

  return {
    totalRevenue,
    totalExpenses,
    totalSalaries,
    totalMilkPurchases,
    totalAdditionalExpenses
  };
};

export const getExpenseCategories = (): ExpenseCategory[] => {
  const totals = calculateTotals();
  
  return [
    {
      id: 'salaries',
      name: 'Salaries',
      amount: totals.totalSalaries,
      icon: 'Users',
      color: 'bg-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Employee wages including basic salary, overtime, and allowances'
    },
    {
      id: 'milk-purchases',
      name: 'Milk Purchases',
      amount: totals.totalMilkPurchases,
      icon: 'Milk',
      color: 'bg-green-600',
      bgColor: 'bg-green-50',
      description: 'Raw milk procurement from local dairy farms'
    },
    {
      id: 'additional-expenses',
      name: 'Additional Expenses',
      amount: totals.totalAdditionalExpenses,
      icon: 'Plus',
      color: 'bg-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Utilities, maintenance, transportation, and other operational costs'
    }
  ];
};