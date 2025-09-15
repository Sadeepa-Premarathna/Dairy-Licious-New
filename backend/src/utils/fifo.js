import mongoose from 'mongoose';
import InventoryBatch from '../models/InventoryBatch.js';

// Consume stock FIFO for one product. Returns {consumptions:[{batchId, qty}]}
export async function consumeFifoForProduct({ session, productId, quantity }) {
  if (quantity <= 0) return { consumptions: [] };
  const batches = await InventoryBatch.find({ product: productId, remaining: { $gt: 0 } })
    .sort({ receivedAt: 1 })
    .session(session);

  let remainingToConsume = quantity;
  const consumptions = [];
  for (const batch of batches) {
    if (remainingToConsume <= 0) break;
    const take = Math.min(batch.remaining, remainingToConsume);
    if (take > 0) {
      batch.remaining -= take;
      await batch.save({ session });
      consumptions.push({ batchId: batch._id, qty: take });
      remainingToConsume -= take;
    }
  }

  if (remainingToConsume > 0) {
    const err = new Error('Insufficient stock');
    err.code = 'INSUFFICIENT_STOCK';
    err.shortageQty = remainingToConsume;
    throw err;
  }

  return { consumptions };
}

// Wrap order consumption in a transaction for multiple items
export async function consumeOrderItemsFifo(items) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const allConsumptions = [];
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


