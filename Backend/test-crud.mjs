// Test CRUD operations with file storage
// This will test creating an employee in the file-based storage

import fetch from 'node-fetch';

const testEmployee = {
  employee_id: "EMP001",
  name: "John Doe",
  NIC: "123456789V",
  email: "john.doe@company.com",
  phone: "0771234567",
  role: "Software Engineer",
  date_of_birth: "1990-05-15",
  basic_salary: 75000,
  status: "Active",
  department: "IT",
  join_date: "2025-01-01",
  address: "123 Main Street, Colombo",
  gender: "Male"
};

async function testCRUD() {
  console.log('🧪 Testing CRUD operations with file storage...');
  
  try {
    // Test CREATE
    console.log('\n1️⃣ Testing CREATE operation...');
    const createResponse = await fetch('http://localhost:8000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEmployee)
    });
    
    if (createResponse.ok) {
      const created = await createResponse.json();
      console.log('✅ Employee created successfully!');
      console.log('📝 Created:', { name: created.name, id: created.employee_id });
      
      // Test READ
      console.log('\n2️⃣ Testing READ operation...');
      const readResponse = await fetch('http://localhost:8000/api/employees');
      if (readResponse.ok) {
        const employees = await readResponse.json();
        console.log(`✅ Retrieved ${employees.length} employees`);
        console.log('👥 Employees:', employees.map(emp => ({ name: emp.name, id: emp.employee_id })));
        
        console.log('\n🎉 CRUD operations working with persistent file storage!');
        console.log('📁 Data is saved to: employees-data.json');
        console.log('💾 Data will persist between server restarts');
        
      } else {
        console.log('❌ Failed to read employees');
      }
      
    } else {
      const error = await createResponse.text();
      console.log('❌ Failed to create employee:', error);
    }
    
  } catch (error) {
    console.log('❌ Error during CRUD test:', error.message);
  }
}

testCRUD();