export interface Employee {
  employee_id: string;
  name: string;
  nic: string;
  email: string;
  phone: string;
  role: string;
  date_of_birth: string;
  basic_salary: number;
  status: string;
}

export interface AttendanceRecord {
  attendance_id: string;
  employee_id: string;
  month: string;
  working_days: number;
  ot_hours: number;
}

export interface LeaveRecord {
  leave_id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

export interface SalarySlipData {
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}