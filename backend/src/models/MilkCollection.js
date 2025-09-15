import mongoose from 'mongoose';

const MilkCollectionSchema = new mongoose.Schema(
  {
    farmerName: { type: String, required: true, trim: true },
    farmerId: { type: String },
    date: { type: Date, default: Date.now },
    liters: { type: Number, required: true, min: 0 },
    fatPercent: { type: Number, default: 0 },
    pricePerLiter: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('MilkCollection', MilkCollectionSchema);


