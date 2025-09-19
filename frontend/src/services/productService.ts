import axios from 'axios';
import { Product, ProductFilter, ProductResponse, ProductFormData, ShopFilter } from '../types/product';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productService = {
  // =============================================================================
  // ADMIN METHODS - For managing products from admin panel
  // =============================================================================

  // Get all products with filtering (Admin)
  getAdminProducts: async (filter: ProductFilter = {}): Promise<ProductResponse> => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/products/admin?${params}`);
    return response.data;
  },

  // Create new product (Admin)
  createProduct: async (productData: FormData): Promise<Product> => {
    const response = await api.post('/products/admin', productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update product (Admin)
  updateProduct: async (id: string, productData: FormData): Promise<Product> => {
    const response = await api.put(`/products/admin/${id}`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete product (Admin)
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/admin/${id}`);
  },

  // Bulk update products (Admin)
  bulkUpdateProducts: async (ids: string[], updates: Partial<Product>): Promise<void> => {
    await api.patch('/products/admin/bulk', { ids, updates });
  },

  // =============================================================================
  // SHOP METHODS - For your existing shop to consume products
  // =============================================================================

  // Get products for shop (only active)
  getShopProducts: async (filter: ShopFilter = {}): Promise<ProductResponse> => {
    const params = new URLSearchParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/products/shop?${params}`);
    return response.data;
  },

  // Get featured products for shop homepage
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await api.get(`/products/shop/featured?limit=${limit}`);
    return response.data.products;
  },

  // Get single product for shop
  getShopProduct: async (identifier: string): Promise<Product> => {
    const response = await api.get(`/products/shop/${identifier}`);
    return response.data;
  },

  // Get products by category for shop
  getProductsByCategory: async (category: string, limit: number = 12, page: number = 1): Promise<ProductResponse> => {
    const response = await api.get(`/products/shop/category/${category}?limit=${limit}&page=${page}`);
    return response.data;
  },

  // Get search suggestions for shop
  getSearchSuggestions: async (query: string): Promise<string[]> => {
    if (!query || query.length < 2) return [];
    
    const response = await api.get(`/products/shop/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data.suggestions;
  },

  // =============================================================================
  // SHARED METHODS - For both admin and shop
  // =============================================================================

  // Get single product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get all product categories
  getCategories: async (): Promise<{ categories: Array<{name: string, count: number, activeCount: number, slug: string}> }> => {
    const response = await api.get('/products/categories/all');
    return response.data;
  },

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  // Create FormData from product data
  createFormData: (productData: Partial<ProductFormData>, images?: FileList): FormData => {
    const formData = new FormData();
    
    // Add basic fields
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    // Add images
    if (images) {
      Array.from(images).forEach(image => {
        formData.append('images', image);
      });
    }
    
    return formData;
  },

  // Format price for display
  formatPrice: (price: number, currency: string = '₹'): string => {
    return `${currency}${price.toFixed(2)}`;
  },

  // Calculate discounted price
  calculateDiscountedPrice: (product: Product): number => {
    if (!product.discount || !product.discount.value) return product.price;
    
    const now = new Date();
    if (product.discount.startDate && now < new Date(product.discount.startDate)) return product.price;
    if (product.discount.endDate && now > new Date(product.discount.endDate)) return product.price;
    
    if (product.discount.type === 'percentage') {
      return product.price - (product.price * product.discount.value / 100);
    } else {
      return Math.max(0, product.price - product.discount.value);
    }
  },

  // Get stock status
  getStockStatus: (product: Product): 'inStock' | 'lowStock' | 'outOfStock' => {
    if (product.stock === 0) return 'outOfStock';
    if (product.stock <= (product.minStock || 5)) return 'lowStock';
    return 'inStock';
  },

  // Check if product is on sale
  isOnSale: (product: Product): boolean => {
    if (!product.discount || !product.discount.value) return false;
    
    const now = new Date();
    if (product.discount.startDate && now < new Date(product.discount.startDate)) return false;
    if (product.discount.endDate && now > new Date(product.discount.endDate)) return false;
    
    return true;
  },

  // Generate SKU
  generateSKU: (productName: string): string => {
    const timestamp = Date.now().toString().slice(-6);
    const namePrefix = productName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    return `${namePrefix || 'PRD'}-${timestamp}`;
  }
};

export default productService;
