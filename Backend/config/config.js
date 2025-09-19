require('dotenv').config();

const config = {
  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 
         "mongodb+srv://admin:rwZTHKZ4jbDuMFMu@cluster0.82iazhd.mongodb.net/dairy_licious?retryWrites=true&w=majority&appName=Cluster0",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'dairy_licious_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  },

  // Upload configuration
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  }
};

module.exports = config;