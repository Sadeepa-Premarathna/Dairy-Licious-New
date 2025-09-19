import mongoose from 'mongoose';

export async function connectDB(): Promise<mongoose.Connection> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required in environment variables');
  
  mongoose.set('strictQuery', true);
  
  // Connection options that work for both local and Atlas
  const options: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    maxPoolSize: 10,
    minPoolSize: 1
  };

  // Add Atlas-specific options if it's an Atlas connection
  if (mongoUri.includes('mongodb+srv') || mongoUri.includes('mongodb.net')) {
    (options as any).retryWrites = true;
    (options as any).w = 'majority';
    options.serverSelectionTimeoutMS = 30000;
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📡 Connection type:', mongoUri.includes('localhost') ? 'Local' : 'Atlas');
    
    await mongoose.connect(mongoUri, options);
    console.log('✅ Connected to MongoDB successfully');
    console.log('📊 Database:', mongoose.connection.db?.databaseName);
    return mongoose.connection;
  } catch (error: any) {
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
}
