import express from 'express';
import InventoryBatch from '../models/InventoryBatch.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /batches?product&nearExpiryDays=14
router.get('/batches', async (req, res, next) => {
  try {
    const { product, nearExpiryDays = 14 } = req.query;
    const filter = {};
    if (product) filter.product = product;
    const batches = await InventoryBatch.find(filter).populate('product').sort({ receivedAt: -1 });
    const days = Number(nearExpiryDays) || 14;
    const now = new Date();
    const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const data = batches.map((b) => ({
      ...b.toObject(),
      isNearExpiry: b.expiryDate ? b.expiryDate <= cutoff : false,
    }));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /batches (receive stock)
router.post('/batches', async (req, res, next) => {
  try {
    const body = req.body;
    const batch = await InventoryBatch.create({
      product: body.product,
      batchNo: body.batchNo,
      quantity: body.quantity,
      remaining: body.quantity,
      unitCost: body.unitCost,
      expiryDate: body.expiryDate,
      receivedAt: body.receivedAt,
    });
    res.status(201).json(batch);
  } catch (err) {
    next(err);
  }
});

// GET /stock -> on-hand per product
router.get('/stock', async (req, res, next) => {
  try {
    const agg = await InventoryBatch.aggregate([
      { $match: { remaining: { $gt: 0 } } },
      { $group: { _id: '$product', onHand: { $sum: '$remaining' } } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { _id: 0, product: '$product', onHand: 1 } },
    ]);
    res.json(agg);
  } catch (err) {
    next(err);
  }
});

// GET /low-stock
router.get('/low-stock', async (req, res, next) => {
  try {
    const stock = await InventoryBatch.aggregate([
      { $group: { _id: '$product', onHand: { $sum: '$remaining' } } },
    ]);
    const stockMap = new Map(stock.map((s) => [String(s._id), s.onHand]));
    const products = await Product.find({ isActive: true });
    const low = products
      .map((p) => ({ product: p, onHand: stockMap.get(String(p._id)) || 0 }))
      .filter((x) => x.onHand <= x.product.reorderLevel)
      .sort((a, b) => a.onHand - b.onHand);
    res.json(low);
  } catch (err) {
    next(err);
  }
});

export default router;


