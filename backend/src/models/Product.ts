import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  unit: 'pcs' | 'kg' | 'L';
  price: number;
  supplier: string;
  reorderLevel: number;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    category: { type: String, default: '' },
    unit: { type: String, enum: ['pcs', 'kg', 'L'], default: 'pcs' },
    price: { type: Number, default: 0 },
    supplier: { type: String, default: '' },
    reorderLevel: { type: Number, default: 10 },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

ProductSchema.index({ sku: 1 }, { unique: true });

export default mongoose.model<IProduct>('Product', ProductSchema);
