import express from 'express';
import RawMaterial from '../models/RawMaterial.js';

const router = express.Router();

// Get all raw materials
router.get('/', async (req, res) => {
  try {
    const { category, supplier, status, search } = req.query;
    let query = {};

    // Build query based on filters
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (supplier && supplier !== 'all') {
      query.supplier = supplier;
    }

    if (status && status !== 'all') {
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } }
      ];
    }

    const rawMaterials = await RawMaterial.find(query).sort({ name: 1 });
    res.json(rawMaterials);
  } catch (error) {
    console.error('Error fetching raw materials:', error);
    res.status(500).json({ message: 'Failed to fetch raw materials' });
  }
});

// Get raw material by ID
router.get('/:id', async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findById(req.params.id);
    if (!rawMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }
    res.json(rawMaterial);
  } catch (error) {
    console.error('Error fetching raw material:', error);
    res.status(500).json({ message: 'Failed to fetch raw material' });
  }
});

// Create new raw material
router.post('/', async (req, res) => {
  try {
    const rawMaterial = new RawMaterial(req.body);
    await rawMaterial.save();
    res.status(201).json(rawMaterial);
  } catch (error) {
    console.error('Error creating raw material:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update raw material
router.put('/:id', async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!rawMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }
    
    res.json(rawMaterial);
  } catch (error) {
    console.error('Error updating raw material:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'SKU already exists' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete raw material
router.delete('/:id', async (req, res) => {
  try {
    const rawMaterial = await RawMaterial.findByIdAndDelete(req.params.id);
    if (!rawMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }
    res.json({ message: 'Raw material deleted successfully' });
  } catch (error) {
    console.error('Error deleting raw material:', error);
    res.status(500).json({ message: 'Failed to delete raw material' });
  }
});

// Update stock level
router.patch('/:id/stock', async (req, res) => {
  try {
    const { currentStock } = req.body;
    
    if (typeof currentStock !== 'number' || currentStock < 0) {
      return res.status(400).json({ message: 'Invalid stock level' });
    }

    const rawMaterial = await RawMaterial.findByIdAndUpdate(
      req.params.id,
      { currentStock },
      { new: true, runValidators: true }
    );

    if (!rawMaterial) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    res.json(rawMaterial);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Failed to update stock' });
  }
});

// Get low stock raw materials
router.get('/alerts/low-stock', async (req, res) => {
  try {
    const lowStockMaterials = await RawMaterial.find({
      $expr: { $lte: ['$currentStock', '$reorderLevel'] },
      isActive: true
    }).sort({ name: 1 });

    res.json(lowStockMaterials);
  } catch (error) {
    console.error('Error fetching low stock materials:', error);
    res.status(500).json({ message: 'Failed to fetch low stock materials' });
  }
});

// Get expiring raw materials
router.get('/alerts/expiring', async (req, res) => {
  try {
    const daysAhead = parseInt(req.query.days) || 30;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const expiringMaterials = await RawMaterial.find({
      expiryDate: {
        $gte: new Date(),
        $lte: futureDate
      },
      isActive: true
    }).sort({ expiryDate: 1 });

    res.json(expiringMaterials);
  } catch (error) {
    console.error('Error fetching expiring materials:', error);
    res.status(500).json({ message: 'Failed to fetch expiring materials' });
  }
});

// Get stock summary
router.get('/reports/summary', async (req, res) => {
  try {
    const summary = await RawMaterial.aggregate([
      {
        $group: {
          _id: null,
          totalMaterials: { $sum: 1 },
          activeMaterials: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          totalValue: {
            $sum: { $multiply: ['$currentStock', '$unitCost'] }
          },
          lowStockCount: {
            $sum: {
              $cond: [
                { $lte: ['$currentStock', '$reorderLevel'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const categoryBreakdown = await RawMaterial.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: {
            $sum: { $multiply: ['$currentStock', '$unitCost'] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      summary: summary[0] || {
        totalMaterials: 0,
        activeMaterials: 0,
        totalValue: 0,
        lowStockCount: 0
      },
      categoryBreakdown
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: 'Failed to generate summary' });
  }
});

export default router;
