import mongoose, { Document, Schema } from 'mongoose';

export interface IMilkCollection extends Document {
  farmerName: string;
  farmerId?: string;
  date: Date;
  liters: number;
  fatPercent: number;
  pricePerLiter: number;
  amountPaid: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const MilkCollectionSchema = new Schema<IMilkCollection>(
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

export default mongoose.model<IMilkCollection>('MilkCollection', MilkCollectionSchema);
