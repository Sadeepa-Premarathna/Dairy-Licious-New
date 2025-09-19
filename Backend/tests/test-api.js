// Simple test script using curl command to test employee creation
// Run this to test if the API is working

const testData = {
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

console.log('Test employee data:');
console.log(JSON.stringify(testData, null, 2));

console.log('\nTo test manually, run this curl command:');
console.log(`curl -X POST http://localhost:8000/api/employees \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(testData)}'`);