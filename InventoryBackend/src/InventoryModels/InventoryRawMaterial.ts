import mongoose, { Document, Schema } from 'mongoose';

interface SupplierContact {
  phone?: string;
  email?: string;
  address?: string;
}

interface StorageConditions {
  temperature?: string;
  humidity?: string;
  specialRequirements?: string;
}

export interface IRawMaterial extends Document {
  name: string;
  sku: string;
  category: 'Feed' | 'Medicine' | 'Equipment' | 'Chemicals' | 'Supplements' | 'Other';
  unit: 'kg' | 'lbs' | 'tons' | 'liters' | 'gallons' | 'pcs' | 'boxes';
  unitCost: number;
  supplier: string;
  supplierContact?: SupplierContact;
  reorderLevel: number;
  maxStockLevel?: number;
  currentStock: number;
  expiryDate?: Date;
  batchNumber?: string;
  storageLocation?: string;
  storageConditions?: StorageConditions;
  isActive: boolean;
  notes?: string;
  lastUpdated: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  stockStatus: string;
  daysUntilExpiry: number | null;
}

const rawMaterialSchema = new Schema<IRawMaterial>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Feed', 'Medicine', 'Equipment', 'Chemicals', 'Supplements', 'Other'],
    default: 'Other'
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'lbs', 'tons', 'liters', 'gallons', 'pcs', 'boxes'],
    default: 'kg'
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    type: String,
    required: true,
    trim: true
  },
  supplierContact: {
    phone: String,
    email: String,
    address: String
  },
  reorderLevel: {
    type: Number,
    required: true,
    min: 0,
    default: 10
  },
  maxStockLevel: {
    type: Number,
    min: 0
  },
  currentStock: {
    type: Number,
    min: 0,
    default: 0
  },
  expiryDate: {
    type: Date
  },
  batchNumber: {
    type: String,
    trim: true
  },
  storageLocation: {
    type: String,
    trim: true
  },
  storageConditions: {
    temperature: String,
    humidity: String,
    specialRequirements: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
});

// Indexes for better performance
rawMaterialSchema.index({ name: 1 });
rawMaterialSchema.index({ sku: 1 });
rawMaterialSchema.index({ category: 1 });
rawMaterialSchema.index({ supplier: 1 });
rawMaterialSchema.index({ isActive: 1 });

// Virtual for stock status
rawMaterialSchema.virtual('stockStatus').get(function(this: IRawMaterial) {
  if (this.currentStock <= 0) return 'out-of-stock';
  if (this.currentStock <= this.reorderLevel) return 'low-stock';
  if (this.maxStockLevel && this.currentStock >= this.maxStockLevel) return 'overstock';
  return 'in-stock';
});

// Virtual for days until expiry
rawMaterialSchema.virtual('daysUntilExpiry').get(function(this: IRawMaterial) {
  if (!this.expiryDate) return null;
  const days = Math.ceil((this.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return days;
});

// Pre-save middleware to update lastUpdated
rawMaterialSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Ensure virtual fields are serialized
rawMaterialSchema.set('toJSON', { virtuals: true });
rawMaterialSchema.set('toObject', { virtuals: true });

export default mongoose.model<IRawMaterial>('RawMaterial', rawMaterialSchema);
