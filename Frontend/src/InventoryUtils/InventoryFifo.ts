import mongoose, { ClientSession } from 'mongoose';
import InventoryBatch from '../models/InventoryBatch';

interface ConsumptionItem {
  batchId: mongoose.Types.ObjectId;
  qty: number;
}

interface ConsumeResult {
  consumptions: ConsumptionItem[];
}

interface ConsumeParams {
  session: ClientSession;
  productId: string | mongoose.Types.ObjectId;
  quantity: number;
}

interface OrderItem {
  product: string | mongoose.Types.ObjectId;
  qty: number;
}

// Consume stock FIFO for one product. Returns {consumptions:[{batchId, qty}]}
export async function consumeFifoForProduct({ session, productId, quantity }: ConsumeParams): Promise<ConsumeResult> {
  if (quantity <= 0) return { consumptions: [] };
  const batches = await InventoryBatch.find({ product: productId, remaining: { $gt: 0 } })
    .sort({ receivedAt: 1 })
    .session(session);

  let remainingToConsume = quantity;
  const consumptions: ConsumptionItem[] = [];
  for (const batch of batches) {
    if (remainingToConsume <= 0) break;
    const take = Math.min(batch.remaining, remainingToConsume);
    if (take > 0) {
      batch.remaining -= take;
      await batch.save({ session });
      consumptions.push({ batchId: batch._id as mongoose.Types.ObjectId, qty: take });
      remainingToConsume -= take;
    }
  }

  if (remainingToConsume > 0) {
    const err = new Error('Insufficient stock') as any;
    err.code = 'INSUFFICIENT_STOCK';
    err.shortageQty = remainingToConsume;
    throw err;
  }

  return { consumptions };
}

// Wrap order consumption in a transaction for multiple items
export async function consumeOrderItemsFifo(items: OrderItem[]): Promise<ConsumptionItem[]> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const allConsumptions: ConsumptionItem[] = [];
    for (const item of items) {
      const { consumptions } = await consumeFifoForProduct({
        session,
        productId: item.product,
        quantity: item.qty,
      });
      allConsumptions.push(...consumptions);
    }
    await session.commitTransaction();
    session.endSession();
    return allConsumptions;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
