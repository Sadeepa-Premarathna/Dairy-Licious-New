import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 0 },
    priceAtSale: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ConsumptionSchema = new mongoose.Schema(
  {
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryBatch', required: true },
    qty: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, default: 0 },
    consumptions: { type: [ConsumptionSchema], default: [] },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { updatedAt: 'updatedAt' } }
);

export default mongoose.model('Order', OrderSchema);


