import Employee from '../Models/HREmployeeModel.js';
import mongoose from 'mongoose';
import Joi from 'joi';

// Comprehensive validation schema for employee creation
const createEmployeeSchema = Joi.object({
  employee_id: Joi.string()
    .pattern(/^EMP\d{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Employee ID must start with "EMP" followed by exactly 4 digits (e.g., EMP0001)',
      'any.required': 'Employee ID is required'
    }),

  name: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters and spaces',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),

  NIC: Joi.string()
    .pattern(/^\d{9}[Vv]$/)
    .required()
    .messages({
      'string.pattern.base': 'NIC must be exactly 10 characters: 9 digits followed by V or v',
      'any.required': 'NIC is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be between 10-15 digits only',
      'any.required': 'Phone number is required'
    }),

  role: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.min': 'Role must be at least 2 characters',
      'any.required': 'Role is required'
    }),

  date_of_birth: Joi.date()
    .max('now')
    .custom((value, helpers) => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      let finalAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        finalAge = age - 1;
      }
      
      if (finalAge < 18) {
        return helpers.error('custom.age');
      }
      return value;
    })
    .required()
    .messages({
      'date.max': 'Date of birth cannot be in the future',
      'custom.age': 'Employee must be at least 18 years old',
      'any.required': 'Date of birth is required'
    }),

  basic_salary: Joi.number()
    .positive()
    .min(1000)
    .required()
    .messages({
      'number.positive': 'Salary must be a positive number',
      'number.min': 'Minimum salary is 1000',
      'any.required': 'Basic salary is required'
    }),

  status: Joi.string()
    .valid('Active', 'Inactive', 'Resigned', 'Terminated')
    .required()
    .messages({
      'any.only': 'Status must be one of: Active, Inactive, Resigned, Terminated',
      'any.required': 'Status is required'
    }),

  department: Joi.string()
    .valid('HR', 'Finance', 'Manufacturing', 'Sales', 'Distribution')
    .required()
    .messages({
      'any.only': 'Department must be one of: HR, Finance, Manufacturing, Sales, Distribution',
      'any.required': 'Department is required'
    }),

  join_date: Joi.date()
    .max('now')
    .custom((value, helpers) => {
      const { date_of_birth } = helpers.state.ancestors[0];
      if (!date_of_birth) return value;
      
      const joinDate = new Date(value);
      const birthDate = new Date(date_of_birth);
      const yearsDiff = joinDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = joinDate.getMonth() - birthDate.getMonth();
      
      let finalYears = yearsDiff;
      if (monthDiff < 0 || (monthDiff === 0 && joinDate.getDate() < birthDate.getDate())) {
        finalYears = yearsDiff - 1;
      }
      
      if (finalYears < 18) {
        return helpers.error('custom.join_age');
      }
      return value;
    })
    .required()
    .messages({
      'date.max': 'Join date cannot be in the future',
      'custom.join_age': 'Join date must be at least 18 years after date of birth',
      'any.required': 'Join date is required'
    }),

  address: Joi.string()
    .max(200)
    .allow('')
    .messages({
      'string.max': 'Address cannot exceed 200 characters'
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'Other', '')
    .allow('')
    .messages({
      'any.only': 'Gender must be one of: Male, Female, Other'
    })
});

// Validation schema for employee updates (all fields optional except ID)
const updateEmployeeSchema = createEmployeeSchema.fork(
  ['employee_id', 'name', 'NIC', 'email', 'phone', 'role', 'date_of_birth', 'basic_salary', 'status', 'department', 'join_date'],
  (schema) => schema.optional()
);

// Helper function to check uniqueness
const checkUniqueness = async (field, value, excludeId = null) => {
  const query = { [field]: value };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const existing = await Employee.findOne(query);
  return !existing;
};

// Validation middleware
const validateEmployee = (schema) => {
  return async (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, { abortEarly: false });
      
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors 
        });
      }
      
      req.validatedBody = value;
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Validation error', error: err.message });
    }
  };
};

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const { name, role, department, status } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (status) filter.status = status;

    const employees = await Employee.find(filter).sort({ createdAt: -1 });
    console.log(`📊 Retrieved ${employees.length} employees from MongoDB`);
    return res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({ message: 'Server error while fetching employees' });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    return res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return res.status(500).json({ message: 'Server error while fetching employee' });
  }
};

// Create employee with comprehensive validation
export const createEmployee = async (req, res) => {
  try {
    // Validate request body using Joi schema
    const { error, value } = createEmployeeSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }

    const {
      employee_id, name, NIC, email, phone, role,
      date_of_birth, basic_salary, status,
      department, join_date, address, gender
    } = value;

    // Check uniqueness constraints
    const isEmployeeIdUnique = await checkUniqueness('employee_id', employee_id);
    if (!isEmployeeIdUnique) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: [{ field: 'employee_id', message: 'Employee ID already exists' }]
      });
    }

    const isNicUnique = await checkUniqueness('NIC', NIC);
    if (!isNicUnique) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: [{ field: 'NIC', message: 'NIC already exists' }]
      });
    }

    const isEmailUnique = await checkUniqueness('email', email);
    if (!isEmailUnique) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: [{ field: 'email', message: 'Email already exists' }]
      });
    }

    // Create employee record
    const employee = await Employee.create({
      employee_id, name, NIC, email, phone, role,
      date_of_birth: new Date(date_of_birth),
      basic_salary: Number(basic_salary),
      status, department,
      join_date: new Date(join_date),
      address: address || '',
      gender: gender || undefined
    });

    console.log(`🎉 SUCCESS: Employee created in MongoDB: ${name} (ID: ${employee_id})`);
    console.log(`📦 MongoDB database: ${mongoose.connection.db.databaseName}`);
    console.log(`📋 Collection: employees`);
    
    return res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      // Handle MongoDB duplicate key errors
      const field = Object.keys(error.keyPattern)[0];
      const friendlyFieldNames = {
        'employee_id': 'Employee ID',
        'NIC': 'NIC',
        'email': 'Email'
      };
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: [{ 
          field: field, 
          message: `${friendlyFieldNames[field] || field} already exists` 
        }]
      });
    }
    return res.status(500).json({ message: 'Server error while creating employee' });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Validate status enum if provided
    if (updates.status) {
      const validStatuses = ['Active', 'Resigned', 'On Probation', 'On Leave'];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ message: 'Invalid status. Must be one of: Active, Resigned, On Probation, On Leave' });
      }
    }

    // Validate gender enum if provided
    if (updates.gender && !['Male', 'Female', 'Other'].includes(updates.gender)) {
      return res.status(400).json({ message: 'Invalid gender. Must be one of: Male, Female, Other' });
    }

    // Validate basic_salary if provided
    if (updates.basic_salary != null && updates.basic_salary <= 0) {
      return res.status(400).json({ message: 'Basic salary must be greater than 0' });
    }

    // Guard: NIC uniqueness if changed
    if (updates.NIC) {
      const exists = await Employee.findOne({ NIC: updates.NIC, employee_id: { $ne: id } });
      if (exists) {
        return res.status(400).json({ message: 'NIC already exists' });
      }
    }

    // Convert dates & numbers
    if (updates.date_of_birth) updates.date_of_birth = new Date(updates.date_of_birth);
    if (updates.join_date) updates.join_date = new Date(updates.join_date);
    if (updates.basic_salary != null) updates.basic_salary = Number(updates.basic_salary);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const employee = await Employee.findByIdAndUpdate(id, updates, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    console.log(`✅ Employee updated in MongoDB: ${employee.name} (ID: ${employee.employee_id})`);
    return res.status(200).json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.code === 11000) {
      if (error.keyPattern?.NIC) return res.status(400).json({ message: 'NIC already exists' });
      if (error.keyPattern?.employee_id) return res.status(400).json({ message: 'Employee ID already exists' });
      return res.status(400).json({ message: 'Duplicate key', error: error.keyValue });
    }
    return res.status(500).json({ message: 'Server error while updating employee' });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    console.log(`🗑️ Employee deleted from MongoDB: ${employee.name} (ID: ${employee.employee_id})`);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Server error while deleting employee' });
  }
};

// Check if Employee ID exists (for frontend validation)
export const checkEmployeeId = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const exists = await Employee.findOne({ employee_id });
    return res.status(200).json({ exists: !!exists });
  } catch (error) {
    console.error('Error checking employee ID:', error);
    return res.status(500).json({ message: 'Server error while checking employee ID' });
  }
};

// Check if NIC exists (for frontend validation)
export const checkNIC = async (req, res) => {
  try {
    const { nic } = req.params;
    const exists = await Employee.findOne({ NIC: nic });
    return res.status(200).json({ exists: !!exists });
  } catch (error) {
    console.error('Error checking NIC:', error);
    return res.status(500).json({ message: 'Server error while checking NIC' });
  }
};

// Check if Email exists (for frontend validation)
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const decodedEmail = decodeURIComponent(email);
    const exists = await Employee.findOne({ email: decodedEmail });
    return res.status(200).json({ exists: !!exists });
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ message: 'Server error while checking email' });
  }
};