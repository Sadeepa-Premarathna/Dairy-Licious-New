import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  qty: number;
  priceAtSale: number;
}

export interface IConsumption {
  batchId: mongoose.Types.ObjectId;
  qty: number;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  total: number;
  consumptions: IConsumption[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 0 },
    priceAtSale: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ConsumptionSchema = new Schema<IConsumption>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: 'InventoryBatch', required: true },
    qty: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    items: { type: [OrderItemSchema], default: [] },
    total: { type: Number, default: 0 },
    consumptions: { type: [ConsumptionSchema], default: [] },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: { updatedAt: 'updatedAt' } }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
