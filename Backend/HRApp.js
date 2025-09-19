import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

import EmployeeRoutes from './Routes/HREmployeeRoutes.js';
import Employee from './Models/HREmployeeModel.js';

dotenv.config();

// Force DNS to use Google's DNS servers to avoid resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/api/employees', EmployeeRoutes);

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI; 
const MONGODB_DB = process.env.MONGODB_DB || 'test';

console.log(`🔧 Connecting to database: ${MONGODB_DB}`);
console.log(`🔧 Collection will be: employees`);

(async () => {
	let usingDatabase = false;
	
	try {
		if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
		mongoose.set('strictQuery', true);
		
		console.log(`🔄 Attempting to connect to MongoDB...`);
		console.log(`🔄 Connection URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
		
		// Use the exact working configuration from the test
		await mongoose.connect(MONGODB_URI, { 
			dbName: MONGODB_DB,
			serverSelectionTimeoutMS: 15000,
			socketTimeoutMS: 45000,
			connectTimeoutMS: 15000,
			maxPoolSize: 10,
			retryWrites: true,
			family: 4 // Force IPv4 - this was key to making it work!
		});
		
		console.log(`✅ MongoDB connected successfully to database: ${MONGODB_DB}`);
		console.log(`📦 Employee records will be stored in: ${MONGODB_DB}.employees`);
		usingDatabase = true;

		// Test the connection by checking collections
		const collections = await mongoose.connection.db.listCollections().toArray();
		console.log(`📋 Available collections: ${collections.map(c => c.name).join(', ') || 'None'}`);

		// Check current employee count
		const employeeCollection = mongoose.connection.db.collection('employees');
		const employeeCount = await employeeCollection.countDocuments();
		console.log(`👥 Current employee count in MongoDB: ${employeeCount}`);

		// Cleanup legacy/stale indexes that can cause duplicate key on null (e.g., nic: null)
		try {
			const indexes = await employeeCollection.indexes();
			for (const idx of indexes) {
				if (idx.key && idx.key.nic === 1) {
					console.log('⚠️  Dropping stale index:', idx.name);
					await employeeCollection.dropIndex(idx.name).catch(() => {});
				}
			}
			// Ensure Mongoose-declared indexes are in sync
			await Employee.syncIndexes();
			console.log('🔧 Indexes synchronized');
		} catch (indexErr) {
			console.warn('Index synchronization warning:', indexErr?.message || indexErr);
		}
		
	} catch (err) {
		console.error('❌ MongoDB connection failed:', err.message || err);
		console.log('� CRITICAL: MongoDB connection required for this application');
		console.log('💡 Please ensure:');
		console.log('   1. Internet connection is stable');
		console.log('   2. MongoDB Atlas cluster is running');
		console.log('   3. IP address is whitelisted');
		console.log('   4. Connection string is correct');
		console.log('');
		console.log('🔄 You can use the create-employees-mongodb.js script for direct MongoDB access');
		process.exit(1);
	}
	
	app.listen(PORT, () => {
		console.log(`🚀 Server listening on port ${PORT}`);
		console.log(`📄 Health check: http://localhost:${PORT}/health`);
		console.log(`👥 Employee API: http://localhost:${PORT}/api/employees`);
		
		if (usingDatabase) {
			console.log(`🗄️  Database: ${mongoose.connection.db.databaseName}`);
			console.log(`✅ Using MongoDB for data persistence`);
			console.log(`🎯 Employee records will be saved to MongoDB Atlas test.employees collection`);
		}
	});
})();
