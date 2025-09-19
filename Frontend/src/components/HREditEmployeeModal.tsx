import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { Employee } from '../data/mockData';

interface EditEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdated: (employee: Employee) => void;
}

type FormState = {
  name: string;
  nic: string;
  email: string;
  phone: string;
  role: string;
  date_of_birth: string;
  basic_salary: string;
  status: Employee['status'];
  department: string;
  join_date: string;
  address: string;
  gender: '' | 'Male' | 'Female' | 'Other';
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-()\s]{7,20}$/;
const nicRegex = /^[A-Za-z0-9]{8,15}$/;

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ employee, onClose, onUpdated }) => {
  const [form, setForm] = useState<FormState>({
    name: employee.name || '',
    nic: employee.nic || '',
    email: employee.email || '',
    phone: employee.phone || '',
    role: employee.role || '',
    date_of_birth: employee.dateOfBirth ? employee.dateOfBirth.slice(0, 10) : '',
    basic_salary: String(employee.salary ?? ''),
    status: employee.status,
    department: employee.department || '',
    join_date: employee.joinDate ? employee.joinDate.slice(0, 10) : '',
    address: employee.address || '',
    gender: (employee.gender as any) || '',
  });
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    nic: false,
    email: false,
    phone: false,
    role: false,
    date_of_birth: false,
    basic_salary: false,
    status: false,
    department: false,
    join_date: false,
    address: false,
    gender: false,
  });

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.nic.trim()) e.nic = 'NIC is required';
    else if (!nicRegex.test(form.nic.trim())) e.nic = 'NIC format is invalid';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!emailRegex.test(form.email.trim())) e.email = 'Email is invalid';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!phoneRegex.test(form.phone.trim())) e.phone = 'Phone is invalid';
    if (!form.role.trim()) e.role = 'Role is required';
    if (!form.date_of_birth) e.date_of_birth = 'Date of birth is required';
    if (!form.basic_salary) e.basic_salary = 'Base salary is required';
    else if (Number.isNaN(Number(form.basic_salary)) || Number(form.basic_salary) <= 0) e.basic_salary = 'Enter a valid amount';
    if (!form.status) e.status = 'Status is required';
    if (!form.department.trim()) e.department = 'Department is required';
    if (!form.join_date) e.join_date = 'Join date is required';
    return e;
  }, [form]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const setField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<keyof FormState, boolean> = { ...touched } as any;
    (Object.keys(form) as Array<keyof FormState>).forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);
    if (!isValid) return;

    try {
      const payload: any = {
        name: form.name.trim(),
        NIC: form.nic.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role.trim(),
        date_of_birth: form.date_of_birth,
        basic_salary: Number(form.basic_salary),
        status: form.status,
        department: form.department.trim(),
        join_date: form.join_date,
        address: form.address.trim(),
        gender: form.gender || undefined,
      };

      const res = await fetch(`http://localhost:8000/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || 'Failed to update employee');
        return;
      }

      const updated: Employee = {
        id: employee.id,
        employeeId: data.employee_id ?? employee.employeeId,
        name: data.name,
        nic: data.NIC,
        role: data.role,
        department: data.department,
        status: data.status,
        joinDate: (data.join_date || '').toString().slice(0, 10),
        dateOfBirth: (data.date_of_birth || '').toString().slice(0, 10),
        phone: data.phone,
        email: data.email,
        address: data.address || '',
        salary: Number(data.basic_salary),
        bankAccount: employee.bankAccount,
        epfEligible: employee.epfEligible,
        etfEligible: employee.etfEligible,
        attendanceRate: employee.attendanceRate,
        gender: data.gender || '',
      };

      onUpdated(updated);
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Unexpected error while updating employee');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Employee</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input className={`w-full px-3 py-2 border rounded-lg ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'}`} value={form.name} onChange={(e) => setField('name', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, name: true }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
              <input className={`w-full px-3 py-2 border rounded-lg ${touched.nic && errors.nic ? 'border-red-500' : 'border-gray-300'}`} value={form.nic} onChange={(e) => setField('nic', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, nic: true }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className={`w-full px-3 py-2 border rounded-lg ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'}`} value={form.email} onChange={(e) => setField('email', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, email: true }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input className={`w-full px-3 py-2 border rounded-lg ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'}`} value={form.phone} onChange={(e) => setField('phone', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, phone: true }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input className={`w-full px-3 py-2 border rounded-lg ${touched.role && errors.role ? 'border-red-500' : 'border-gray-300'}`} value={form.role} onChange={(e) => setField('role', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, role: true }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="date" className={`w-full px-3 py-2 border rounded-lg ${touched.date_of_birth && errors.date_of_birth ? 'border-red-500' : 'border-gray-300'}`} value={form.date_of_birth} onChange={(e) => setField('date_of_birth', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, date_of_birth: true }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
              <input type="number" className={`w-full px-3 py-2 border rounded-lg ${touched.basic_salary && errors.basic_salary ? 'border-red-500' : 'border-gray-300'}`} value={form.basic_salary} onChange={(e) => setField('basic_salary', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, basic_salary: true }))} min={0} step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className={`w-full px-3 py-2 border rounded-lg ${touched.status && errors.status ? 'border-red-500' : 'border-gray-300'}`} value={form.status} onChange={(e) => setField('status', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, status: true }))}>
                <option value="Active">Active</option>
                <option value="On Probation">On Probation</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input className={`w-full px-3 py-2 border rounded-lg ${touched.department && errors.department ? 'border-red-500' : 'border-gray-300'}`} value={form.department} onChange={(e) => setField('department', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, department: true }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
              <input type="date" className={`w-full px-3 py-2 border rounded-lg ${touched.join_date && errors.join_date ? 'border-red-500' : 'border-gray-300'}`} value={form.join_date} onChange={(e) => setField('join_date', e.target.value)} onBlur={() => setTouched(prev => ({ ...prev, join_date: true }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select className="w-full px-3 py-2 border rounded-lg border-gray-300" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea className="w-full px-3 py-2 border rounded-lg border-gray-300" rows={3} value={form.address} onChange={(e) => setField('address', e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors" disabled={!isValid}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;


