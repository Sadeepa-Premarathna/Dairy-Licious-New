import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { Employee } from '../data/mockData';

interface AddEmployeeModalProps {
  onClose: () => void;
  onCreate: (employee: Employee) => void;
}

interface FormValues {
  employee_id: string;
  name: string;
  nic: string;
  email: string;
  phone: string;
  role: string;
  date_of_birth: string;
  basic_salary: number;
  status: 'Active' | 'Inactive' | 'Resigned' | 'Terminated';
  department: string;
  join_date: string;
  address: string;
  gender: 'Male' | 'Female' | 'Other' | '';
}

// Validation Schema with all the required rules
const validationSchema = Yup.object({
  employee_id: Yup.string()
    .required('Employee ID is required')
    .matches(/^EMP\d{4}$/, 'Employee ID must start with "EMP" followed by exactly 4 digits (e.g., EMP0001)')
    .test('unique-employee-id', 'Employee ID already exists', async function(value) {
      if (!value) return true;
      try {
        const response = await fetch(`http://localhost:8000/api/employees/check-employee-id/${value}`);
        const data = await response.json();
        return !data.exists;
      } catch (error) {
        return true; // Allow if can't check (will be caught by backend)
      }
    }),

  name: Yup.string()
    .required('Employee name is required')
    .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),

  nic: Yup.string()
    .required('NIC is required')
    .matches(/^\d{9}[Vv]$/, 'NIC must be exactly 10 characters: 9 digits followed by V or v')
    .test('unique-nic', 'NIC already exists', async function(value) {
      if (!value) return true;
      try {
        const response = await fetch(`http://localhost:8000/api/employees/check-nic/${value}`);
        const data = await response.json();
        return !data.exists;
      } catch (error) {
        return true; // Allow if can't check (will be caught by backend)
      }
    }),

  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .test('unique-email', 'Email already exists', async function(value) {
      if (!value) return true;
      try {
        const response = await fetch(`http://localhost:8000/api/employees/check-email/${encodeURIComponent(value)}`);
        const data = await response.json();
        return !data.exists;
      } catch (error) {
        return true; // Allow if can't check (will be caught by backend)
      }
    }),

  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10,15}$/, 'Phone number must be between 10-15 digits only'),

  role: Yup.string()
    .required('Role is required')
    .min(2, 'Role must be at least 2 characters'),

  date_of_birth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age-18', 'Employee must be at least 18 years old', function(value) {
      if (!value) return true;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),

  basic_salary: Yup.number()
    .required('Basic salary is required')
    .positive('Salary must be a positive number')
    .min(1000, 'Minimum salary is 1000'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['Active', 'Inactive', 'Resigned', 'Terminated'], 'Please select a valid status'),

  department: Yup.string()
    .required('Department is required')
    .oneOf(['HR', 'Finance', 'Manufacturing', 'Sales', 'Distribution'], 'Please select a valid department'),

  join_date: Yup.date()
    .required('Join date is required')
    .max(new Date(), 'Join date cannot be in the future')
    .test('join-after-18', 'Join date must be at least 18 years after date of birth', function(value) {
      const { date_of_birth } = this.parent;
      if (!value || !date_of_birth) return true;
      
      const joinDate = new Date(value);
      const birthDate = new Date(date_of_birth);
      const yearsDiff = joinDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = joinDate.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && joinDate.getDate() < birthDate.getDate())) {
        return yearsDiff - 1 >= 18;
      }
      return yearsDiff >= 18;
    }),

  address: Yup.string()
    .max(200, 'Address cannot exceed 200 characters'),

  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other', ''], 'Please select a valid gender')
});

const initialValues: FormValues = {
  employee_id: '',
  name: '',
  nic: '',
  email: '',
  phone: '',
  role: '',
  date_of_birth: '',
  basic_salary: 0,
  status: 'Active',
  department: '',
  join_date: '',
  address: '',
  gender: ''
};

const AddEmployeeModalEnhanced: React.FC<AddEmployeeModalProps> = ({ onClose, onCreate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        employee_id: values.employee_id,
        name: values.name,
        NIC: values.nic,
        email: values.email,
        phone: values.phone,
        role: values.role,
        date_of_birth: values.date_of_birth,
        basic_salary: values.basic_salary,
        status: values.status,
        department: values.department,
        join_date: values.join_date,
        address: values.address,
        gender: values.gender || undefined,
      };

      const response = await fetch('http://localhost:8000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create employee');
      }

      const created: Employee = {
        id: data.id,
        employeeId: values.employee_id,
        name: data.name,
        nic: data.NIC,
        role: data.role,
        department: data.department,
        status: data.status,
        joinDate: new Date(data.join_date).toISOString().slice(0, 10),
        dateOfBirth: new Date(data.date_of_birth).toISOString().slice(0, 10),
        phone: data.phone,
        email: data.email,
        address: data.address || '',
        salary: Number(data.basic_salary),
        bankAccount: '',
        epfEligible: false,
        etfEligible: false,
        attendanceRate: 0,
        gender: data.gender || '',
      };

      onCreate(created);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isValid }) => (
            <Form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="employee_id"
                    type="text"
                    placeholder="EMP0001"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.employee_id && touched.employee_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="employee_id" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">Format: EMP followed by 4 digits</p>
                </div>

                {/* Employee Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">Letters and spaces only</p>
                </div>

                {/* NIC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIC <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="nic"
                    type="text"
                    placeholder="123456789V"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nic && touched.nic ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="nic" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">9 digits followed by V or v</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="phone"
                    type="text"
                    placeholder="0771234567"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">10-15 digits only</p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="role"
                    type="text"
                    placeholder="Software Engineer"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.role && touched.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="role" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="department"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.department && touched.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Sales">Sales</option>
                    <option value="Distribution">Distribution</option>
                  </Field>
                  <ErrorMessage name="department" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.status && touched.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Resigned">Resigned</option>
                    <option value="Terminated">Terminated</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="date_of_birth"
                    type="date"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.date_of_birth && touched.date_of_birth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="date_of_birth" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 18 years old</p>
                </div>

                {/* Join Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Join Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="join_date"
                    type="date"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.join_date && touched.join_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="join_date" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">Cannot be future date, must be 18+ years after DOB</p>
                </div>

                {/* Basic Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Salary <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="basic_salary"
                    type="number"
                    min="1000"
                    step="100"
                    placeholder="50000"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.basic_salary && touched.basic_salary ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage name="basic_salary" component="div" className="text-red-500 text-xs mt-1" />
                  <p className="text-xs text-gray-500 mt-1">Minimum: 1000</p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
                </div>
              </div>

              {/* Address - Full Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <Field
                  as="textarea"
                  name="address"
                  rows={3}
                  placeholder="Optional address"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                />
                <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Employee'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddEmployeeModalEnhanced;