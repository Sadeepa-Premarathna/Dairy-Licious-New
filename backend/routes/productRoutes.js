const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/products/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// =============================================================================
// ADMIN ROUTES - For managing products from admin panel
// =============================================================================

// Get all products with filtering and pagination (Admin)
router.get('/admin', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      brand,
      search,
      status,
      featured,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') filter.category = new RegExp(category, 'i');
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (inStock === 'true') filter.stock = { $gt: 0 };
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { sku: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Get categories for filter
    const categories = await Product.distinct('category');
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => ({
        name: cat, 
        slug: cat.toLowerCase().replace(/\s+/g, '-'),
        count: await Product.countDocuments({ category: cat, status: 'active' })
      }))
    );

    res.json({
      products,
      totalPages,
      currentPage: parseInt(page),
      total,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new product (Admin)
router.post('/admin', upload.array('images', 5), async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
      productData.thumbnail = productData.images[0]; // First image as thumbnail
    }

    // Parse JSON fields if they are strings
    const jsonFields = ['specifications', 'dimensions', 'seo', 'discount', 'tags'];
    jsonFields.forEach(field => {
      if (productData[field] && typeof productData[field] === 'string') {
        try {
          productData[field] = JSON.parse(productData[field]);
        } catch (e) {
          console.warn(`Failed to parse ${field}:`, e);
        }
      }
    });

    // Generate SKU if not provided
    if (!productData.sku) {
      const timestamp = Date.now().toString().slice(-6);
      const namePrefix = productData.name.substring(0, 3).toUpperCase();
      productData.sku = `${namePrefix}-${timestamp}`;
    }

    const product = new Product(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'SKU already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Update product (Admin)
router.put('/admin/:id', upload.array('images', 5), async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
      productData.thumbnail = productData.images[0];
    }

    // Parse JSON fields if they exist
    const jsonFields = ['specifications', 'dimensions', 'seo', 'discount', 'tags'];
    jsonFields.forEach(field => {
      if (productData[field] && typeof productData[field] === 'string') {
        try {
          productData[field] = JSON.parse(productData[field]);
        } catch (e) {
          console.warn(`Failed to parse ${field}:`, e);
        }
      }
    });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...productData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product (Admin)
router.delete('/admin/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Clean up image files
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk update products (Admin)
router.patch('/admin/bulk', async (req, res) => {
  try {
    const { ids, updates } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Product IDs are required' });
    }
    
    const result = await Product.updateMany(
      { _id: { $in: ids } },
      { ...updates, updatedAt: new Date() }
    );
    
    res.json({ 
      message: `${result.modifiedCount} products updated successfully`,
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================================================
// SHOP ROUTES - For your existing shop to consume products
// =============================================================================

// Get products for shop (only active products)
router.get('/shop', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      brand,
      search,
      sortBy = 'featured',
      featured
    } = req.query;

    // Shop only shows active products
    const filter = { status: 'active' };
    
    if (category && category !== 'all') filter.category = new RegExp(category, 'i');
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (featured === 'true') filter.featured = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Shop-specific sorting
    let sort = {};
    switch (sortBy) {
      case 'featured':
        sort = { featured: -1, createdAt: -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { 'ratings.average': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    // Get categories with counts for shop filters
    const categories = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      products,
      totalPages,
      currentPage: parseInt(page),
      total,
      categories
    });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured products for shop
router.get('/shop/featured', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const products = await Product.find({ 
      status: 'active', 
      featured: true 
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json({ products });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product by ID or SKU (Shop)
router.get('/shop/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by SKU
    let product = await Product.findOne({
      $and: [
        { status: 'active' },
        {
          $or: [
            { _id: identifier },
            { sku: identifier.toUpperCase() }
          ]
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get products by category (Shop)
router.get('/shop/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12, page = 1 } = req.query;
    
    const filter = { 
      status: 'active',
      category: new RegExp(category, 'i')
    };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await Product.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
      
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
      category
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search suggestions for shop
router.get('/shop/search/suggestions', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }
    
    const suggestions = await Product.find({
      status: 'active',
      name: new RegExp(q, 'i')
    })
    .select('name')
    .limit(parseInt(limit))
    .lean();
    
    res.json({
      suggestions: suggestions.map(p => p.name)
    });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// =============================================================================
// SHARED ROUTES - For both admin and shop
// =============================================================================

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        activeCount: { 
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        }
      }},
      { $project: { 
        name: '$_id', 
        count: 1, 
        activeCount: 1,
        slug: { $toLower: { $replaceAll: { input: '$_id', find: ' ', replacement: '-' } } },
        _id: 0 
      }},
      { $sort: { name: 1 } }
    ]);
    
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
