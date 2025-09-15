import mongoose from 'mongoose';

const InventoryBatchSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    batchNo: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 0 },
    remaining: { type: Number, required: true, min: 0 },
    unitCost: { type: Number, default: 0 },
    expiryDate: { type: Date },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure remaining never negative at the model-level as a safety net
InventoryBatchSchema.pre('save', function (next) {
  if (this.remaining < 0) {
    return next(new Error('Remaining cannot be negative'));
  }
  next();
});

export default mongoose.model('InventoryBatch', InventoryBatchSchema);


