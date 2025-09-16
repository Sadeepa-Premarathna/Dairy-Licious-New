const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb+srv://admin:rwZTHKZ4jbDuMFMu@cluster0.82iazhd.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Import routes
const milkRoutes = require("./routes/milkRoutes");

// Routes
app.use("/api/milk", milkRoutes);

// Test API
app.get("/", (req, res) => {
  res.json({ 
    message: "Milk Collection & Distribution API",
    version: "1.0.0",
    endpoints: {
      "GET /api/milk": "Get all milk records",
      "POST /api/milk": "Create new milk record",
      "GET /api/milk/:id": "Get milk record by ID",
      "PUT /api/milk/:id": "Update milk record",
      "DELETE /api/milk/:id": "Delete milk record",
      "GET /api/milk/farmer/:farmerId": "Get all records by farmer",
      "GET /api/milk/collection-point/:point": "Get all records by collection point",
      "GET /api/milk/stats/summary": "Get summary statistics"
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
