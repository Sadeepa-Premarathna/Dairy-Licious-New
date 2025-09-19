import express from 'express';
import MilkCollection from '../models/MilkCollection.js';

const router = express.Router();

// GET list with date range & farmer filters
router.get('/', async (req, res, next) => {
  try {
    const { from, to, farmerName, farmerId } = req.query;
    const filter = {};
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    if (farmerName) filter.farmerName = new RegExp(farmerName, 'i');
    if (farmerId) filter.farmerId = farmerId;
    const items = await MilkCollection.find(filter).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const item = await MilkCollection.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

// GET /stats -> totals by day/week/month (last 30 days)
router.get('/stats', async (req, res, next) => {
  try {
    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const agg = await MilkCollection.aggregate([
      { $match: { date: { $gte: last30 } } },
      {
        $group: {
          _id: {
            y: { $year: '$date' },
            m: { $month: '$date' },
            d: { $dayOfMonth: '$date' },
          },
          liters: { $sum: '$liters' },
          amount: { $sum: { $multiply: ['$liters', '$pricePerLiter'] } },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
    ]);
    res.json(agg);
  } catch (err) {
    next(err);
  }
});

export default router;


