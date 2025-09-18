const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection - force dbName to 'test' unless overridden
const dbUri = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME || 'test';
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName,
})
.then(() => console.log(`Connected to MongoDB (dbName=${dbName}): ${dbUri}`))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
const attendanceRoutes = require('./Routes/AttendanceRoutes');

app.use('/api/attendance', attendanceRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'DairyLicious Backend API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
