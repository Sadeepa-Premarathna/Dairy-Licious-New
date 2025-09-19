import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Product from './models/Product.js';
import InventoryBatch from './models/InventoryBatch.js';
import Order from './models/Order.js';
import MilkCollection from './models/MilkCollection.js';
import RawMaterial from './models/RawMaterial.js';
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
    RawMaterial.deleteMany({}),
  ]);

  const products = await Product.insertMany([
    { name: 'Fresh Milk 1L', sku: 'MILK-1L', category: 'Dairy', unit: 'L', price: 2.5, supplier: 'Local Farm', reorderLevel: 20 },
    { name: 'Yogurt Cup', sku: 'YOG-100', category: 'Dairy', unit: 'pcs', price: 1.2, supplier: 'Dairy Co', reorderLevel: 50 },
    { name: 'Cheddar Cheese 500g', sku: 'CHE-500', category: 'Dairy', unit: 'kg', price: 8.0, supplier: 'Cheese Ltd', reorderLevel: 15 },
    { name: 'Butter 250g', sku: 'BUT-250', category: 'Dairy', unit: 'pcs', price: 3.0, supplier: 'Dairy Co', reorderLevel: 25 },
    { name: 'Cream 200ml', sku: 'CRM-200', category: 'Dairy', unit: 'L', price: 1.8, supplier: 'Dairy Co', reorderLevel: 30 },
  ]);

  // Create raw materials data
  const rawMaterials = await RawMaterial.insertMany([
    {
      name: 'Premium Cattle Feed',
      sku: 'FEED-001',
      category: 'Feed',
      unit: 'kg',
      unitCost: 0.85,
      supplier: 'AgroFeed Solutions',
      supplierContact: {
        phone: '+94 11 234 5678',
        email: 'orders@agrofeed.lk',
        address: 'No. 123, Industrial Zone, Colombo 07'
      },
      reorderLevel: 500,
      maxStockLevel: 2000,
      currentStock: 1250,
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
      batchNumber: 'CF-2024-001',
      storageLocation: 'Warehouse A - Section 1',
      storageConditions: {
        temperature: 'Room Temperature (18-25°C)',
        humidity: 'Below 60%',
        specialRequirements: 'Keep away from moisture and direct sunlight'
      },
      notes: 'High-protein feed for dairy cattle'
    },
    {
      name: 'Veterinary Antibiotics',
      sku: 'MED-001',
      category: 'Medicine',
      unit: 'pcs',
      unitCost: 15.50,
      supplier: 'VetCare Lanka',
      supplierContact: {
        phone: '+94 11 345 6789',
        email: 'sales@vetcare.lk',
        address: 'Medical District, Colombo 08'
      },
      reorderLevel: 20,
      maxStockLevel: 100,
      currentStock: 35,
      expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000), // 2 years
      batchNumber: 'AB-2024-003',
      storageLocation: 'Medical Storage - Refrigerated',
      storageConditions: {
        temperature: '2-8°C',
        humidity: 'Controlled',
        specialRequirements: 'Refrigerated storage required'
      },
      notes: 'For treating bacterial infections in cattle'
    },
    {
      name: 'Milking Machine Parts',
      sku: 'EQP-001',
      category: 'Equipment',
      unit: 'pcs',
      unitCost: 125.00,
      supplier: 'DairyTech Equipment',
      supplierContact: {
        phone: '+94 11 456 7890',
        email: 'info@dairytech.lk',
        address: 'Tech Park, Malabe'
      },
      reorderLevel: 5,
      maxStockLevel: 25,
      currentStock: 8,
      batchNumber: 'MP-2024-002',
      storageLocation: 'Equipment Room',
      storageConditions: {
        temperature: 'Room Temperature',
        humidity: 'Dry Environment',
        specialRequirements: 'Keep in original packaging'
      },
      notes: 'Replacement parts for milking equipment'
    },
    {
      name: 'Cleaning Disinfectant',
      sku: 'CHE-001',
      category: 'Chemicals',
      unit: 'liters',
      unitCost: 8.75,
      supplier: 'CleanTech Solutions',
      supplierContact: {
        phone: '+94 11 567 8901',
        email: 'orders@cleantech.lk',
        address: 'Chemical Complex, Kelaniya'
      },
      reorderLevel: 50,
      maxStockLevel: 200,
      currentStock: 125,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      batchNumber: 'CD-2024-005',
      storageLocation: 'Chemical Storage',
      storageConditions: {
        temperature: 'Room Temperature',
        humidity: 'Dry',
        specialRequirements: 'Separate from food products, ventilated area'
      },
      notes: 'For sanitizing milking equipment and facilities'
    },
    {
      name: 'Calcium Supplements',
      sku: 'SUP-001',
      category: 'Supplements',
      unit: 'kg',
      unitCost: 12.30,
      supplier: 'NutriVet Supplements',
      supplierContact: {
        phone: '+94 11 678 9012',
        email: 'sales@nutrivet.lk',
        address: 'Nutrition Center, Gampaha'
      },
      reorderLevel: 25,
      maxStockLevel: 100,
      currentStock: 45,
      expiryDate: new Date(Date.now() + 540 * 24 * 60 * 60 * 1000), // 18 months
      batchNumber: 'CS-2024-004',
      storageLocation: 'Supplement Storage',
      storageConditions: {
        temperature: 'Cool, Dry Place',
        humidity: 'Below 50%',
        specialRequirements: 'Away from heat and moisture'
      },
      notes: 'Essential calcium for dairy cow health'
    },
    {
      name: 'Hay Bales Premium',
      sku: 'FEED-002',
      category: 'Feed',
      unit: 'pcs',
      unitCost: 25.00,
      supplier: 'Green Meadows Farm',
      supplierContact: {
        phone: '+94 33 234 5678',
        email: 'hay@greenmeadows.lk',
        address: 'Meadowlands, Kurunegala'
      },
      reorderLevel: 30,
      maxStockLevel: 150,
      currentStock: 85,
      batchNumber: 'HB-2024-001',
      storageLocation: 'Feed Storage Barn',
      storageConditions: {
        temperature: 'Ambient',
        humidity: 'Dry',
        specialRequirements: 'Elevated storage to prevent moisture damage'
      },
      notes: 'High-quality hay for cattle feeding'
    }
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

  console.log('Seed complete - Products and Raw Materials created successfully!');
  console.log(`Created ${products.length} products and ${rawMaterials.length} raw materials`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});


