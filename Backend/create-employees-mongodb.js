import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'test';

console.log('🎯 Direct MongoDB Employee Creation');
console.log('🔧 This script will create employees directly in MongoDB');

async function createEmployeeInMongoDB() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        
        await mongoose.connect(MONGODB_URI, {
            dbName: MONGODB_DB,
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 15000,
            maxPoolSize: 10,
            retryWrites: true,
            family: 4 // Force IPv4 - this was key!
        });
        
        console.log('✅ Connected to MongoDB successfully!');
        console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
        
        // Define the employee schema inline for direct creation
        const employeeSchema = new mongoose.Schema({
            employee_id: { type: String, required: true, unique: true },
            name: { type: String, required: true },
            NIC: { type: String, required: true, unique: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            role: { type: String, required: true },
            date_of_birth: { type: Date, required: true },
            basic_salary: { type: Number, required: true },
            status: { type: String, required: true, enum: ['Active', 'Resigned', 'On Leave', 'On Probation'] },
            department: { type: String, required: true },
            join_date: { type: Date, required: true },
            address: { type: String },
            gender: { type: String, enum: ['Male', 'Female', 'Other'] }
        }, { timestamps: true });
        
        const Employee = mongoose.model('Employee', employeeSchema, 'employees');
        
        // Check current employee count
        const currentCount = await Employee.countDocuments();
        console.log(`📊 Current employee count: ${currentCount}`);
        
        // Test employees to create
        const testEmployees = [
            {
                employee_id: 'EMP003',
                name: 'Alice Johnson',
                NIC: '456789123V',
                email: 'alice.johnson@company.com',
                phone: '555-0125',
                role: 'Marketing Specialist',
                date_of_birth: new Date('1992-03-10'),
                basic_salary: 65000,
                status: 'Active',
                department: 'Marketing',
                join_date: new Date('2024-03-01'),
                address: '789 Pine St',
                gender: 'Female'
            },
            {
                employee_id: 'EMP004',
                name: 'Bob Smith',
                NIC: '789123456V',
                email: 'bob.smith@company.com',
                phone: '555-0126',
                role: 'DevOps Engineer',
                date_of_birth: new Date('1985-07-22'),
                basic_salary: 85000,
                status: 'Active',
                department: 'Engineering',
                join_date: new Date('2024-01-10'),
                address: '321 Oak Ave',
                gender: 'Male'
            }
        ];
        
        for (const employeeData of testEmployees) {
            try {
                console.log(`🔄 Creating employee: ${employeeData.name}`);
                
                // Check if employee already exists
                const existing = await Employee.findOne({ 
                    $or: [
                        { employee_id: employeeData.employee_id },
                        { NIC: employeeData.NIC }
                    ]
                });
                
                if (existing) {
                    console.log(`⚠️  Employee ${employeeData.name} already exists, skipping...`);
                    continue;
                }
                
                const employee = await Employee.create(employeeData);
                console.log(`✅ Created employee: ${employee.name} (ID: ${employee.employee_id})`);
                console.log(`📝 MongoDB _id: ${employee._id}`);
                
            } catch (empError) {
                console.error(`❌ Failed to create ${employeeData.name}:`, empError.message);
            }
        }
        
        // Final count check
        const finalCount = await Employee.countDocuments();
        console.log(`📊 Final employee count: ${finalCount}`);
        
        // List all employees
        const allEmployees = await Employee.find({}, 'employee_id name role department').sort({ createdAt: -1 });
        console.log('\n👥 All employees in MongoDB:');
        allEmployees.forEach(emp => {
            console.log(`   ${emp.employee_id}: ${emp.name} - ${emp.role} (${emp.department})`);
        });
        
        await mongoose.disconnect();
        console.log('\n🎉 MongoDB employee creation completed successfully!');
        console.log('💡 Your employees are now stored in MongoDB Atlas test.employees collection');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createEmployeeInMongoDB();