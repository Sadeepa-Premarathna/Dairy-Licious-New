import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_DB = process.env.MONGODB_DB || 'test';

console.log('🔧 Testing multiple MongoDB connection methods...');

async function testConnections() {
    const connectionStrings = [
        // Original SRV connection
        'mongodb+srv://admin:j2Bz3ICkH3zVPiQQ@cluster0.82iazhd.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0',
        
        // Try without appName
        'mongodb+srv://admin:j2Bz3ICkH3zVPiQQ@cluster0.82iazhd.mongodb.net/test?retryWrites=true&w=majority',
        
        // Try with SSL explicitly
        'mongodb+srv://admin:j2Bz3ICkH3zVPiQQ@cluster0.82iazhd.mongodb.net/test?retryWrites=true&w=majority&ssl=true',
        
        // Try with different options
        'mongodb+srv://admin:j2Bz3ICkH3zVPiQQ@cluster0.82iazhd.mongodb.net/test?retryWrites=true&w=majority&authSource=admin'
    ];
    
    for (let i = 0; i < connectionStrings.length; i++) {
        const uri = connectionStrings[i];
        console.log(`\n🔄 Testing connection ${i + 1}/${connectionStrings.length}...`);
        console.log(`📋 URI: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
        
        try {
            const options = {
                dbName: MONGODB_DB,
                serverSelectionTimeoutMS: 15000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 15000,
                maxPoolSize: 10,
                retryWrites: true,
                family: 4 // Force IPv4
            };
            
            await mongoose.connect(uri, options);
            
            console.log('✅ Connection successful!');
            console.log('📦 Database:', mongoose.connection.db.databaseName);
            
            // Test creating a document
            const testCollection = mongoose.connection.db.collection('employees');
            const count = await testCollection.countDocuments();
            console.log(`📊 Current employee count: ${count}`);
            
            await mongoose.disconnect();
            console.log('✅ Connection test completed successfully');
            
            console.log(`\n🎉 SUCCESS! Use this connection string in your .env file:`);
            console.log(`MONGODB_URI=${uri}`);
            return;
            
        } catch (error) {
            console.error(`❌ Connection ${i + 1} failed:`, error.message);
            
            if (mongoose.connection.readyState !== 0) {
                await mongoose.disconnect();
            }
        }
    }
    
    console.log('\n💥 All connection attempts failed.');
    console.log('💡 Please check:');
    console.log('   1. MongoDB Atlas cluster is running (not paused)');
    console.log('   2. Your IP address is whitelisted in MongoDB Atlas');
    console.log('   3. Username and password are correct');
    console.log('   4. Network/firewall allows MongoDB Atlas connections');
}

testConnections();