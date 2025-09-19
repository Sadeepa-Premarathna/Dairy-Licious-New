import express, { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { consumeOrderItemsFifo } from '../utils/fifo';

const router = express.Router();

// GET list (date range filters)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.query;
    const filter: any = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from as string);
      if (to) filter.createdAt.$lte = new Date(to as string);
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const o = await Order.findById(req.params.id);
    if (!o) return res.status(404).json({ message: 'Order not found' });
    res.json(o);
  } catch (err) {
    next(err);
  }
});

// POST create order and consume stock FIFO
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items = [], notes = '' } = req.body;
    if (!items.length) return res.status(400).json({ message: 'Order must have items' });

    // Enrich items with priceAtSale if only product ids given
    const productIds = items.map((i: any) => i.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const priceMap = new Map(products.map((p) => [String(p._id), p.price]));
    const normalizedItems = items.map((i: any) => ({
      product: i.product,
      qty: i.qty,
      priceAtSale: i.priceAtSale ?? priceMap.get(String(i.product)) ?? 0,
    }));

    // Try consume
    let consumptions = [];
    try {
      consumptions = await consumeOrderItemsFifo(normalizedItems);
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_STOCK') {
        return res.status(400).json({ message: 'Insufficient stock for one or more items' });
      }
      throw err;
    }

    const total = normalizedItems.reduce((sum: number, i: any) => sum + i.qty * i.priceAtSale, 0);
    const order = await Order.create({ items: normalizedItems, total, consumptions, notes });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// DELETE optional: reverse consumption (simple implementation)
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // For simplicity, just delete order; reversal can be added later if desired
    await Order.deleteOne({ _id: order._id });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
