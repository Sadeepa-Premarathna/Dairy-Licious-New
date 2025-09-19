// Employee Validation Test Examples
// Run these in your browser console or test them through the form

// Valid Employee Data Example:
const validEmployee = {
  employee_id: "EMP0123",
  name: "John Smith",
  nic: "123456789V",
  email: "john.smith@company.com",
  phone: "0771234567",
  role: "Software Engineer",
  date_of_birth: "1990-01-15",
  basic_salary: 75000,
  status: "Active",
  department: "Manufacturing",
  join_date: "2020-01-15",
  address: "123 Main Street, Colombo",
  gender: "Male"
};

// Invalid Employee Data Examples (will trigger validation errors):

// 1. Invalid Employee ID (should be EMP followed by 4 digits)
const invalidEmployeeId = {
  ...validEmployee,
  employee_id: "EMPLOYEE001" // ❌ Wrong format
};

// 2. Invalid Name (contains numbers)
const invalidName = {
  ...validEmployee,
  name: "John123 Smith" // ❌ Contains numbers
};

// 3. Invalid NIC (wrong format)
const invalidNIC = {
  ...validEmployee,
  nic: "12345678X" // ❌ Should end with V or v
};

// 4. Invalid Phone (contains letters)
const invalidPhone = {
  ...validEmployee,
  phone: "077-123-4567" // ❌ Should only contain digits
};

// 5. Too young (under 18)
const tooYoung = {
  ...validEmployee,
  date_of_birth: "2010-01-15" // ❌ Under 18 years old
};

// 6. Invalid Department
const invalidDepartment = {
  ...validEmployee,
  department: "IT Department" // ❌ Not in allowed list
};

// 7. Future join date
const futureJoinDate = {
  ...validEmployee,
  join_date: "2030-01-15" // ❌ Cannot be in future
};

// 8. Joined before 18th birthday
const joinedTooYoung = {
  ...validEmployee,
  date_of_birth: "2000-01-15",
  join_date: "2015-01-15" // ❌ Joined at age 15
};

// Test the validation by submitting these through the form
console.log("Use these test cases to verify validation is working:");
console.log("✅ Valid:", validEmployee);
console.log("❌ Invalid Employee ID:", invalidEmployeeId);
console.log("❌ Invalid Name:", invalidName);
console.log("❌ Invalid NIC:", invalidNIC);
console.log("❌ Invalid Phone:", invalidPhone);
console.log("❌ Too Young:", tooYoung);
console.log("❌ Invalid Department:", invalidDepartment);
console.log("❌ Future Join Date:", futureJoinDate);
console.log("❌ Joined Too Young:", joinedTooYoung);