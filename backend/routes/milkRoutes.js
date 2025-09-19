const express = require("express");
const router = express.Router();
const MilkRecord = require("../models/MilkRecord");

// GET all milk records
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, farmerName, collectionPoint, distributionStatus } = req.query;
    const query = {};
    
    if (farmerName) query.farmerName = { $regex: farmerName, $options: 'i' };
    if (collectionPoint) query.collectionPoint = { $regex: collectionPoint, $options: 'i' };
    if (distributionStatus) query.distributionStatus = distributionStatus;

    const records = await MilkRecord.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MilkRecord.countDocuments(query);

    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET records by farmer
router.get("/farmer/:farmerId", async (req, res) => {
  try {
    const { farmerId } = req.params;
    const records = await MilkRecord.find({ farmerId })
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET records by collection point
router.get("/collection-point/:point", async (req, res) => {
  try {
    const { point } = req.params;
    const records = await MilkRecord.find({ collectionPoint: point })
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single milk record by ID
router.get("/:id", async (req, res) => {
  try {
    const record = await MilkRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Milk record not found" });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new milk record
router.post("/", async (req, res) => {
  try {
    console.log("Received POST request body:", req.body);
    
    const { 
      farmerName, 
      farmerId, 
      quantity, 
      qualityGrade, 
      fatContent, 
      pricePerLiter, 
      collectionPoint, 
      distributionStatus, 
      notes, 
      collectedBy 
    } = req.body;
    
    console.log("Extracted fields:", {
      farmerName, farmerId, quantity, qualityGrade, fatContent,
      pricePerLiter, collectionPoint, distributionStatus, notes, collectedBy
    });
    
    if (!farmerName || !farmerId || !quantity || !pricePerLiter || !collectionPoint || !collectedBy) {
      console.log("Validation failed - missing required fields");
      return res.status(400).json({ 
        message: "Farmer name, farmer ID, quantity, price per liter, collection point, and collected by are required" 
      });
    }

    const newRecord = new MilkRecord({
      farmerName,
      farmerId,
      quantity,
      qualityGrade,
      fatContent,
      pricePerLiter,
      collectionPoint,
      distributionStatus,
      notes,
      collectedBy
    });

    console.log("Created new record object:", newRecord);
    const savedRecord = await newRecord.save();
    console.log("Successfully saved record:", savedRecord);
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("Error creating milk record:", error);
    console.error("Error details:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// PUT update milk record
router.put("/:id", async (req, res) => {
  try {
    const { 
      farmerName, 
      farmerId, 
      quantity, 
      qualityGrade, 
      fatContent, 
      pricePerLiter, 
      collectionPoint, 
      distributionStatus, 
      notes, 
      collectedBy 
    } = req.body;
    
    const updatedRecord = await MilkRecord.findByIdAndUpdate(
      req.params.id,
      {
        farmerName,
        farmerId,
        quantity,
        qualityGrade,
        fatContent,
        pricePerLiter,
        collectionPoint,
        distributionStatus,
        notes,
        collectedBy,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Milk record not found" });
    }

    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE milk record
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecord = await MilkRecord.findByIdAndDelete(req.params.id);
    
    if (!deletedRecord) {
      return res.status(404).json({ message: "Milk record not found" });
    }

    res.json({ message: "Milk record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET summary statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const totalRecords = await MilkRecord.countDocuments();
    const totalQuantity = await MilkRecord.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    const totalAmount = await MilkRecord.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    
    const statusBreakdown = await MilkRecord.aggregate([
      { $group: { _id: "$distributionStatus", count: { $sum: 1 } } }
    ]);

    res.json({
      totalRecords,
      totalQuantity: totalQuantity[0]?.total || 0,
      totalAmount: totalAmount[0]?.total || 0,
      statusBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
