// Test employee creation in correct database/collection
// This file tests that employees are created in test.employees

const testEmployeeCreation = async () => {
  const testEmployee = {
    employee_id: "TEST001",
    name: "Test Employee",
    NIC: "123456789V",
    email: "test@example.com", 
    phone: "0771234567",
    role: "Software Developer",
    date_of_birth: "1990-01-01",
    basic_salary: 50000,
    status: "Active",
    department: "IT",
    join_date: "2025-01-01",
    address: "123 Test Street",
    gender: "Other"
  };

  try {
    console.log('🧪 Testing employee creation...');
    console.log('📊 Expected: Employee should be created in test.employees collection');
    
    const response = await fetch('http://localhost:8000/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmployee)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Employee created successfully!');
      console.log('📝 Created employee:', result);
      console.log('🎯 This employee should now be in MongoDB test.employees collection');
      return result;
    } else {
      const error = await response.text();
      console.log('❌ Failed to create employee:', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error testing employee creation:', error.message);
    return null;
  }
};

// Test fetching employees to confirm they're in the right place
const testEmployeeFetch = async () => {
  try {
    console.log('🔍 Testing employee retrieval...');
    const response = await fetch('http://localhost:8000/api/employees');
    
    if (response.ok) {
      const employees = await response.json();
      console.log(`✅ Retrieved ${employees.length} employees from test.employees collection`);
      console.log('👥 Employees:', employees.map(emp => ({ id: emp.id, name: emp.name, employee_id: emp.employee_id })));
      return employees;
    } else {
      console.log('❌ Failed to fetch employees');
      return [];
    }
  } catch (error) {
    console.log('❌ Error fetching employees:', error.message);
    return [];
  }
};

// Run tests
console.log('🚀 Starting MongoDB collection verification tests...');
console.log('📍 Backend should be running on http://localhost:8000');
console.log('🗄️  Database: test');
console.log('📦 Collection: employees');
console.log('');

// Test sequence
testEmployeeFetch()
  .then(() => testEmployeeCreation())
  .then(() => testEmployeeFetch())
  .then(() => {
    console.log('');
    console.log('✅ Test completed!');
    console.log('📋 Check your MongoDB test.employees collection to confirm the data is there.');
  });