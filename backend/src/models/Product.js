import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
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

export default mongoose.model('Product', ProductSchema);


