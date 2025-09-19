import Employee from '../Models/HREmployeeModel.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'employees-data.json');

// Helper function to save file data
const saveFileData = (data) => {
	fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
	global.fileEmployees = data;
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

// Create employee
export const createEmployee = async (req, res) => {
  try {
    const {
      employee_id, name, NIC, email, phone, role,
      date_of_birth, basic_salary, status,
      department, join_date, address, gender
    } = req.body;

    // Validate required fields
    if (!employee_id || !name || !NIC || !email || !phone || !role || !date_of_birth || basic_salary == null || !status || !department || !join_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate status enum
    const validStatuses = ['Active', 'Resigned', 'On Probation', 'On Leave'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: Active, Resigned, On Probation, On Leave' });
    }

    // Validate gender enum if provided
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender. Must be one of: Male, Female, Other' });
    }

    // Validate basic_salary
    if (basic_salary <= 0) {
      return res.status(400).json({ message: 'Basic salary must be greater than 0' });
    }

    // FORCE MONGODB ATTEMPT FIRST
    console.log('🔄 Attempting to create employee in MongoDB...');
    try {
      // Check if mongoose is connected
      if (mongoose.connection.readyState === 1) {
        console.log('✅ MongoDB connection active, creating in database');
        
        // Ensure NIC is unique
        const existingByNic = await Employee.findOne({ NIC });
        if (existingByNic) {
          return res.status(400).json({ message: 'NIC already exists' });
        }

        // Ensure employee_id is unique
        const existingById = await Employee.findOne({ employee_id });
        if (existingById) {
          return res.status(400).json({ message: 'Employee ID already exists' });
        }

        const employee = await Employee.create({
          employee_id, name, NIC, email, phone, role,
          date_of_birth: new Date(date_of_birth),
          basic_salary: Number(basic_salary),
          status, department,
          join_date: new Date(join_date),
          address, gender
        });

        console.log(`🎉 SUCCESS: Employee created in MongoDB: ${name} (ID: ${employee_id})`);
        console.log(`📦 MongoDB database: ${mongoose.connection.db.databaseName}`);
        console.log(`📋 Collection: employees`);
        
        return res.status(201).json(employee);
      } else {
        console.log('❌ MongoDB not connected, attempting reconnection...');
        
        // Try to reconnect to MongoDB with the working configuration
        await mongoose.connect(process.env.MONGODB_URI, { 
          dbName: process.env.MONGODB_DB || 'test',
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 15000,
          maxPoolSize: 10,
          retryWrites: true,
          family: 4 // Force IPv4 - this was key to making it work!
        });
        
        console.log('✅ Reconnected to MongoDB successfully!');
        
        // Now try creating the employee
        const existingByNic = await Employee.findOne({ NIC });
        if (existingByNic) {
          return res.status(400).json({ message: 'NIC already exists' });
        }

        const existingById = await Employee.findOne({ employee_id });
        if (existingById) {
          return res.status(400).json({ message: 'Employee ID already exists' });
        }

        const employee = await Employee.create({
          employee_id, name, NIC, email, phone, role,
          date_of_birth: new Date(date_of_birth),
          basic_salary: Number(basic_salary),
          status, department,
          join_date: new Date(join_date),
          address, gender
        });

        console.log(`🎉 SUCCESS: Employee created in MongoDB after reconnection: ${name} (ID: ${employee_id})`);
        return res.status(201).json(employee);
      }
    } catch (mongoError) {
      console.log('❌ MongoDB creation failed:', mongoError.message);
      console.log('🔄 Falling back to file storage...');
    }

    // FALLBACK: Check if we're using file storage
    if (global.fileEmployees) {
      console.log('� File mode: Creating employee in file storage');
      
      // Check for duplicates in file mode
      const existingByNic = global.fileEmployees.find(emp => emp.NIC === NIC);
      if (existingByNic) {
        return res.status(400).json({ message: 'NIC already exists' });
      }
      
      const existingById = global.fileEmployees.find(emp => emp.employee_id === employee_id);
      if (existingById) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }

      // Create employee object for file mode
      const fileEmployee = {
        id: Date.now().toString(),
        employee_id,
        name,
        NIC,
        email,
        phone,
        role,
        date_of_birth: new Date(date_of_birth),
        basic_salary: Number(basic_salary),
        status,
        department,
        join_date: new Date(join_date),
        address,
        gender,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedData = [...global.fileEmployees, fileEmployee];
      saveFileData(updatedData);
      
      console.log(`✅ File employee created: ${name} (ID: ${employee_id})`);
      console.log(`📊 Total file employees: ${updatedData.length}`);
      
      return res.status(201).json(fileEmployee);
    }

    // Check if we're in demo mode (no database connection)
    if (global.demoEmployees) {
      console.log('📦 Demo mode: Creating employee in memory');
      
      // Check for duplicates in demo mode
      const existingByNic = global.demoEmployees.find(emp => emp.NIC === NIC);
      if (existingByNic) {
        return res.status(400).json({ message: 'NIC already exists' });
      }
      
      const existingById = global.demoEmployees.find(emp => emp.employee_id === employee_id);
      if (existingById) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }

      // Create employee object for demo mode
      const demoEmployee = {
        id: Date.now().toString(),
        employee_id,
        name,
        NIC,
        email,
        phone,
        role,
        date_of_birth: new Date(date_of_birth),
        basic_salary: Number(basic_salary),
        status,
        department,
        join_date: new Date(join_date),
        address,
        gender,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      global.demoEmployees.push(demoEmployee);
      console.log(`✅ Demo employee created: ${name} (ID: ${employee_id})`);
      console.log(`📊 Total demo employees: ${global.demoEmployees.length}`);
      
      return res.status(201).json(demoEmployee);
    }

    return res.status(500).json({ message: 'No storage mechanism available' });
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      if (error.keyPattern?.employee_id) return res.status(400).json({ message: 'Employee ID already exists' });
      if (error.keyPattern?.NIC) return res.status(400).json({ message: 'NIC already exists' });
      return res.status(400).json({ message: 'Duplicate key', error: error.keyValue });
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

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Server error while deleting employee' });
  }
};
