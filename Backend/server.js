const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 
      "mongodb+srv://admin:rwZTHKZ4jbDuMFMu@cluster0.82iazhd.mongodb.net/dairy_licious?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Import routes
const milkRoutes = require("./routes/milkRoutes");
const productRoutes = require("./routes/productRoutes");
const hrEmployeeRoutes = require("./routes/HREmployeeRoutes");
const attendanceRoutes = require("./routes/AttendanceRoutes");
const allowanceRoutes = require("./routes/AllowanceRoutes");
const financeRoutes = require("./routes/finance_AdditionalExpensesRoutes");

// API Routes
app.use("/api/milk", milkRoutes);
app.use("/api/products", productRoutes);
app.use("/api/employees", hrEmployeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/allowances", allowanceRoutes);
app.use("/api/finance", financeRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Dairy Licious API is running",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

module.exports = app;