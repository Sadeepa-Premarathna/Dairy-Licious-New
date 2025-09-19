import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Employee {
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

interface EMP_Dash_ContextType {
  employee: Employee | null;
  loading: boolean;
  error: string | null;
  fetchEmployee: (employeeId: string) => Promise<void>;
}

const EMP_Dash_Context = createContext<EMP_Dash_ContextType | undefined>(undefined);

export const useEmployee = () => {
  const context = useContext(EMP_Dash_Context);
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};

interface EmployeeProviderProps {
  children: ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployee = async (employeeId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/employees/${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee details');
      }
      const employeeData = await response.json();
      setEmployee(employeeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Mock data for development
      setEmployee({
        employee_id: 'EMP001',
        name: 'John Doe',
        nic: '123456789V',
        email: 'john.doe@dairyfactory.com',
        phone: '+94771234567',
        role: 'Production Supervisor',
        date_of_birth: '1990-05-15',
        basic_salary: 85000,
        status: 'Active'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Mock employee ID - in real app, this would come from authentication
    fetchEmployee('EMP001');
  }, []);

  const value = {
    employee,
    loading,
    error,
    fetchEmployee
  };

  return (
    <EMP_Dash_Context.Provider value={value}>
      {children}
    </EMP_Dash_Context.Provider>
  );
};