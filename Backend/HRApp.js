import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import EmployeeRoutes from './Routes/HREmployeeRoutes.js';
import Employee from './models/HREmployeeModel.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/api/employees', EmployeeRoutes);

const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI; // Ensure .env has a proper Atlas URI with real <username>/<password>
const MONGODB_DB = process.env.MONGODB_DB || 'test';

(async () => {
	try {
		if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
		mongoose.set('strictQuery', true);
		await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB });
		console.log('✅ MongoDB connected');

		// Cleanup legacy/stale indexes that can cause duplicate key on null (e.g., nic: null)
		try {
			const collection = mongoose.connection.db.collection('employees');
			const indexes = await collection.indexes();
			for (const idx of indexes) {
				if (idx.key && idx.key.nic === 1) {
					console.log('⚠️  Dropping stale index:', idx.name);
					await collection.dropIndex(idx.name).catch(() => {});
				}
			}
			// Ensure Mongoose-declared indexes are in sync
			await Employee.syncIndexes();
			console.log('🔧 Indexes synchronized');
		} catch (indexErr) {
			console.warn('Index synchronization warning:', indexErr?.message || indexErr);
		}
		app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
	} catch (err) {
		console.error('❌ MongoDB connection error:', err.message || err);
		process.exit(1);
	}
})();
