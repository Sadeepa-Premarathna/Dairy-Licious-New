import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'test';

console.log('🔧 Testing MongoDB connection...');
console.log('🔧 URI:', MONGODB_URI);
console.log('🔧 Database:', MONGODB_DB);

async function testConnection() {
    try {
        // Test with different connection options
        const options = {
            dbName: MONGODB_DB,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4
        };
        
        console.log('🔄 Attempting to connect...');
        await mongoose.connect(MONGODB_URI, options);
        
        console.log('✅ MongoDB connected successfully!');
        console.log('📦 Database:', mongoose.connection.db.databaseName);
        
        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📋 Collections:', collections.map(c => c.name));
        
        // Test creating a simple document
        const testCollection = mongoose.connection.db.collection('employees');
        const testDoc = {
            test: true,
            timestamp: new Date(),
            message: 'Connection test successful'
        };
        
        const result = await testCollection.insertOne(testDoc);
        console.log('✅ Test document created:', result.insertedId);
        
        // Clean up test document
        await testCollection.deleteOne({ _id: result.insertedId });
        console.log('🧹 Test document cleaned up');
        
        await mongoose.disconnect();
        console.log('✅ Connection test completed successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('❌ Error code:', error.code || 'Unknown');
        
        if (error.message.includes('ENOTFOUND')) {
            console.log('💡 DNS resolution failed. This could be due to:');
            console.log('   - Network connectivity issues');
            console.log('   - Firewall blocking MongoDB Atlas');
            console.log('   - Incorrect cluster URL');
            console.log('   - MongoDB Atlas cluster not running');
        }
        
        process.exit(1);
    }
}

testConnection();