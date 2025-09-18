import express from 'express';
import Product from '../models/Product.js';
import InventoryBatch from '../models/InventoryBatch.js';
import Order from '../models/Order.js';
import MilkCollection from '../models/MilkCollection.js';

const router = express.Router();

router.get('/kpis', async (req, res, next) => {
  try {
    const [totalProducts, onHandAgg, lowStock, batches, todayOrdersAgg, todayRevenueAgg, todayMilkAgg, monthRevenueAgg] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      InventoryBatch.aggregate([{ $group: { _id: null, sum: { $sum: '$remaining' } } }]),
      // low stock count
      (async () => {
        const stock = await InventoryBatch.aggregate([{ $group: { _id: '$product', onHand: { $sum: '$remaining' } } }]);
        const stockMap = new Map(stock.map((s) => [String(s._id), s.onHand]));
        const products = await Product.find({ isActive: true });
        return products.filter((p) => (stockMap.get(String(p._id)) || 0) <= p.reorderLevel).length;
      })(),
      InventoryBatch.find({}).select('expiryDate remaining product batchNo').populate('product'),
      // today's orders count
      (async () => {
        const start = new Date(); start.setHours(0, 0, 0, 0);
        return Order.countDocuments({ createdAt: { $gte: start } });
      })(),
      // today's revenue
      (async () => {
        const start = new Date(); start.setHours(0, 0, 0, 0);
        const agg = await Order.aggregate([{ $match: { createdAt: { $gte: start } } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
        return agg[0]?.total || 0;
      })(),
      // today's milk liters
      (async () => {
        const start = new Date(); start.setHours(0, 0, 0, 0);
        const agg = await MilkCollection.aggregate([{ $match: { date: { $gte: start } } }, { $group: { _id: null, liters: { $sum: '$liters' } } }]);
        return agg[0]?.liters || 0;
      })(),
      // month revenue
      (async () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const agg = await Order.aggregate([{ $match: { createdAt: { $gte: start } } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
        return agg[0]?.total || 0;
      })(),
    ]);

    const nearExpiryCount = batches.filter((b) => b.expiryDate && b.expiryDate <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)).length;
    const totalOnHandUnits = onHandAgg[0]?.sum || 0;

    res.json({
      totalProducts,
      totalOnHandUnits,
      lowStockCount: lowStock,
      nearExpiryCount,
      todayOrders: todayOrdersAgg,
      todayRevenue: todayRevenueAgg,
      todayMilkLiters: todayMilkAgg,
      monthRevenue: monthRevenueAgg,
    });
  } catch (err) { next(err); }
});

router.get('/series', async (req, res, next) => {
  try {
    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [revAgg, milkAgg, lowStock, nearExpiry, recentOrders] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: last30 } } },
        { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' }, d: { $dayOfMonth: '$createdAt' } }, total: { $sum: '$total' } } },
        { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
      ]),
      MilkCollection.aggregate([
        { $match: { date: { $gte: last14 } } },
        { $group: { _id: { y: { $year: '$date' }, m: { $month: '$date' }, d: { $dayOfMonth: '$date' } }, liters: { $sum: '$liters' } } },
        { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
      ]),
      // top5 low stock
      (async () => {
        const stock = await InventoryBatch.aggregate([{ $group: { _id: '$product', onHand: { $sum: '$remaining' } } }]);
        const stockMap = new Map(stock.map((s) => [String(s._id), s.onHand]));
        const products = await Product.find({ isActive: true });
        return products
          .map((p) => ({ product: p, onHand: stockMap.get(String(p._id)) || 0 }))
          .sort((a, b) => a.onHand - b.onHand)
          .slice(0, 5);
      })(),
      // near expiry table
      (async () => {
        const batches = await InventoryBatch.find({}).select('expiryDate remaining product batchNo').populate('product');
        const cutoff = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        return batches
          .filter((b) => b.expiryDate && b.expiryDate <= cutoff)
          .map((b) => ({ product: b.product?.name, batchNo: b.batchNo, expiryDate: b.expiryDate, remaining: b.remaining }));
      })(),
      Order.find({}).sort({ createdAt: -1 }).limit(10).select('_id createdAt total items'),
    ]);

    const revenueLast30Days = revAgg.map((x) => ({
      date: new Date(x._id.y, x._id.m - 1, x._id.d).toISOString().slice(0, 10),
      total: x.total,
    }));
    const milkLast14Days = milkAgg.map((x) => ({
      date: new Date(x._id.y, x._id.m - 1, x._id.d).toISOString().slice(0, 10),
      liters: x.liters,
    }));
    const recentOrdersOut = recentOrders.map((o) => ({ _id: o._id, createdAt: o.createdAt, total: o.total, itemsCount: o.items?.length || 0 }));

    res.json({ revenueLast30Days, milkLast14Days, top5LowStock: lowStock, nearExpiryTable: nearExpiry, recentOrders: recentOrdersOut });
  } catch (err) { next(err); }
});

export default router;


