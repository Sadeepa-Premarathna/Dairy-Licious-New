const mongoose = require('mongoose');

const productSpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

const productReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
});

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  originalPrice: { 
    type: Number, 
    min: 0 
  },
  category: { 
    type: String, 
    required: true,
    index: true
  },
  subCategory: { 
    type: String 
  },
  brand: { 
    type: String,
    index: true
  },
  sku: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0,
    index: true
  },
  minStock: { 
    type: Number, 
    default: 5,
    min: 0
  },
  images: [{ 
    type: String,
    validate: {
      validator: function(v) {
        return v.length <= 10; // Maximum 10 images
      },
      message: 'Maximum 10 images allowed'
    }
  }],
  thumbnail: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'draft', 'outOfStock'], 
    default: 'active',
    index: true
  },
  featured: { 
    type: Boolean, 
    default: false,
    index: true
  },
  tags: [{ 
    type: String,
    lowercase: true,
    trim: true
  }],
  specifications: [productSpecificationSchema],
  dimensions: {
    weight: { type: Number, min: 0 },
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  seo: {
    metaTitle: { 
      type: String,
      maxlength: 60
    },
    metaDescription: { 
      type: String,
      maxlength: 160
    },
    keywords: [{ 
      type: String,
      lowercase: true,
      trim: true
    }]
  },
  discount: {
    type: { 
      type: String, 
      enum: ['percentage', 'fixed'] 
    },
    value: { 
      type: Number, 
      min: 0 
    },
    startDate: { 
      type: Date 
    },
    endDate: { 
      type: Date 
    }
  },
  ratings: {
    average: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    count: { 
      type: Number, 
      default: 0,
      min: 0
    }
  },
  reviews: [productReviewSchema],
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: { 
    type: String 
  },
  updatedBy: { 
    type: String 
  }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Automatically update status based on stock
productSchema.pre('save', function(next) {
  if (this.stock === 0 && this.status !== 'inactive' && this.status !== 'draft') {
    this.status = 'outOfStock';
  } else if (this.status === 'outOfStock' && this.stock > 0) {
    this.status = 'active';
  }
  next();
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (!this.discount || !this.discount.value) return this.price;
  
  const now = new Date();
  if (this.discount.startDate && now < this.discount.startDate) return this.price;
  if (this.discount.endDate && now > this.discount.endDate) return this.price;
  
  if (this.discount.type === 'percentage') {
    return this.price - (this.price * this.discount.value / 100);
  } else {
    return Math.max(0, this.price - this.discount.value);
  }
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock === 0) return 'outOfStock';
  if (this.stock <= this.minStock) return 'lowStock';
  return 'inStock';
});

// Method to add review
productSchema.methods.addReview = function(userId, userName, rating, comment) {
  this.reviews.push({ userId, userName, rating, comment });
  
  // Recalculate average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.ratings.average = totalRating / this.reviews.length;
  this.ratings.count = this.reviews.length;
  
  return this.save();
};

// Static method to find products with filters
productSchema.statics.findWithFilters = function(filters = {}) {
  const query = {};
  
  // Status filter (default to active for shop)
  if (filters.status) {
    query.status = filters.status;
  } else if (filters.shopMode) {
    query.status = 'active'; // Only show active products in shop
  }
  
  // Category filter
  if (filters.category) {
    query.category = new RegExp(filters.category, 'i');
  }
  
  // Brand filter
  if (filters.brand) {
    query.brand = new RegExp(filters.brand, 'i');
  }
  
  // Price range filter
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  
  // Stock filter
  if (filters.inStock === true) {
    query.stock = { $gt: 0 };
  }
  
  // Featured filter
  if (filters.featured === true) {
    query.featured = true;
  }
  
  // Search filter
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query);
};

module.exports = mongoose.model('Product', productSchema);
