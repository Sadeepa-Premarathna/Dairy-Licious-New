// Product types
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  sku: string;
  category: string;
  onHand: number;
  available: number;
  committed: number;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
}

// Raw Material types
export interface RawMaterial {
  _id: string;
  name: string;
  description?: string;
  supplier: string;
  unit: string;
  costPerUnit: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  lastPurchaseDate: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Milk Collection types
export interface MilkCollection {
  _id: string;
  supplierName: string;
  supplierContact?: string;
  quantity: number;
  fatContent: number;
  pricePerLiter: number;
  totalAmount: number;
  date: string;
  qualityGrade: 'A' | 'B' | 'C';
  tested: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardData {
  totalProducts: number;
  totalRawMaterials: number;
  lowStockProducts: number;
  lowStockRawMaterials: number;
  pendingOrders: number;
  todayMilkCollection: number;
  recentOrders: Order[];
  recentMilkCollections: MilkCollection[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
