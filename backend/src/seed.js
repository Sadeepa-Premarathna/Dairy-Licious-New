import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Product from './models/Product.js';
import InventoryBatch from './models/InventoryBatch.js';
import Order from './models/Order.js';
import MilkCollection from './models/MilkCollection.js';
import { consumeOrderItemsFifo } from './utils/fifo.js';

function randomBetween(min, max) { return Math.random() * (max - min) + min; }
function randomInt(min, max) { return Math.floor(randomBetween(min, max)); }

async function seed() {
  const MONGO_URI = process.env.MONGO_URI;
  await connectDB(MONGO_URI);

  await Promise.all([
    InventoryBatch.deleteMany({}),
    Order.deleteMany({}),
    MilkCollection.deleteMany({}),
    Product.deleteMany({}),
  ]);

  const products = await Product.insertMany([
    { name: 'Fresh Milk 1L', sku: 'MILK-1L', category: 'Dairy', unit: 'L', price: 2.5, supplier: 'Local Farm', reorderLevel: 20 },
    { name: 'Yogurt Cup', sku: 'YOG-100', category: 'Dairy', unit: 'pcs', price: 1.2, supplier: 'Dairy Co', reorderLevel: 50 },
    { name: 'Cheddar Cheese 500g', sku: 'CHE-500', category: 'Dairy', unit: 'kg', price: 8.0, supplier: 'Cheese Ltd', reorderLevel: 15 },
    { name: 'Butter 250g', sku: 'BUT-250', category: 'Dairy', unit: 'pcs', price: 3.0, supplier: 'Dairy Co', reorderLevel: 25 },
    { name: 'Cream 200ml', sku: 'CRM-200', category: 'Dairy', unit: 'L', price: 1.8, supplier: 'Dairy Co', reorderLevel: 30 },
  ]);

  const [milk, yogurt, cheese, butter, cream] = products;

  // Create inventory batches with staggered expiry
  const now = new Date();
  const batches = await InventoryBatch.insertMany([
    { product: milk._id, batchNo: 'M-A', quantity: 200, remaining: 200, unitCost: 1.5, expiryDate: new Date(now.getTime() + 7*24*60*60*1000), receivedAt: new Date(now.getTime() - 20*24*60*60*1000) },
    { product: milk._id, batchNo: 'M-B', quantity: 150, remaining: 150, unitCost: 1.6, expiryDate: new Date(now.getTime() + 12*24*60*60*1000), receivedAt: new Date(now.getTime() - 10*24*60*60*1000) },
    { product: yogurt._id, batchNo: 'Y-A', quantity: 400, remaining: 400, unitCost: 0.6, expiryDate: new Date(now.getTime() + 5*24*60*60*1000), receivedAt: new Date(now.getTime() - 8*24*60*60*1000) },
    { product: cheese._id, batchNo: 'C-A', quantity: 80, remaining: 80, unitCost: 5.0, expiryDate: new Date(now.getTime() + 40*24*60*60*1000), receivedAt: new Date(now.getTime() - 25*24*60*60*1000) },
    { product: butter._id, batchNo: 'B-A', quantity: 200, remaining: 200, unitCost: 2.0, expiryDate: new Date(now.getTime() + 60*24*60*60*1000), receivedAt: new Date(now.getTime() - 15*24*60*60*1000) },
    { product: cream._id, batchNo: 'CR-A', quantity: 180, remaining: 180, unitCost: 1.0, expiryDate: new Date(now.getTime() + 10*24*60*60*1000), receivedAt: new Date(now.getTime() - 5*24*60*60*1000) },
  ]);

  // Random orders across last 30 days
  for (let i = 0; i < 40; i++) {
    const dayOffset = randomInt(0, 30);
    const createdAt = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    const items = [
      { product: milk._id, qty: randomInt(1, 6), priceAtSale: milk.price },
      { product: yogurt._id, qty: randomInt(2, 10), priceAtSale: yogurt.price },
    ];

    // Consume FIFO within a session and then create order with custom createdAt
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      for (const it of items) {
        const batchesForProduct = await InventoryBatch.find({ product: it.product, remaining: { $gt: 0 } })
          .sort({ receivedAt: 1 })
          .session(session);
        let rq = it.qty;
        for (const b of batchesForProduct) {
          if (rq <= 0) break;
          const take = Math.min(b.remaining, rq);
          b.remaining -= take;
          await b.save({ session });
          rq -= take;
        }
      }
      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }

    const total = items.reduce((s, x) => s + x.qty * x.priceAtSale, 0);
    await Order.create({ items, total, createdAt });
  }

  // Milk collections last 14 days
  for (let i = 0; i < 30; i++) {
    const dayOffset = randomInt(0, 14);
    const date = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    await MilkCollection.create({
      farmerName: `Farmer ${randomInt(1, 10)}`,
      farmerId: String(randomInt(1000, 9999)),
      date,
      liters: Number(randomBetween(10, 100).toFixed(1)),
      fatPercent: Number(randomBetween(3.0, 6.0).toFixed(1)),
      pricePerLiter: 0.5,
      amountPaid: 0,
    });
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});


