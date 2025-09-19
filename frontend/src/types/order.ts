export interface Order {
  _id?: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  orderItems: OrderItem[];
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalQuantity: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer';
  assignedDriver?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productType: 'fresh_milk' | 'processed_milk' | 'cheese' | 'butter' | 'yogurt';
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface OrderResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  total: number;
}
