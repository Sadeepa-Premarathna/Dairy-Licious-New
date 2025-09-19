export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  brand?: string;
  sku: string;
  stock: number;
  minStock?: number;
  images: string[];
  thumbnail?: string;
  status: 'active' | 'inactive' | 'draft' | 'outOfStock';
  featured?: boolean;
  tags?: string[];
  specifications?: ProductSpecification[];
  dimensions?: {
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: string;
    endDate?: string;
  };
  ratings?: {
    average: number;
    count: number;
  };
  reviews?: ProductReview[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductReview {
  _id?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified?: boolean;
}

export interface ProductCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder?: number;
  productCount?: number;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  status?: string;
  sortBy?: 'name' | 'price' | 'createdAt' | 'stock' | 'category';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  total: number;
  categories?: ProductCategory[];
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  brand?: string;
  sku: string;
  stock: number;
  minStock?: number;
  status: 'active' | 'inactive' | 'draft' | 'outOfStock';
  featured?: boolean;
  tags?: string[];
  specifications?: ProductSpecification[];
  dimensions?: {
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    startDate?: string;
    endDate?: string;
  };
}

export interface ShopFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  search?: string;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}
