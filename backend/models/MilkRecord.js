const mongoose = require("mongoose");

const MilkRecordSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true,
    trim: true
  },
  farmerId: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C'],
    default: 'A'
  },
  fatContent: {
    type: Number,
    min: 0,
    max: 10
  },
  pricePerLiter: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    min: 0
  },
  collectionPoint: {
    type: String,
    required: true,
    trim: true
  },
  distributionStatus: {
    type: String,
    enum: ['collected', 'in_transit', 'delivered', 'pending'],
    default: 'collected'
  },
  notes: {
    type: String,
    default: ''
  },
  collectedBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total amount before saving
MilkRecordSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.pricePerLiter;
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("MilkRecord", MilkRecordSchema);
