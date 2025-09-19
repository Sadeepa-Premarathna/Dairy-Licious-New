// Temporary mock data for testing when MongoDB is not available
export const mockProducts = [
  {
    _id: '1',
    name: 'Whole Milk',
    sku: 'WM001',
    category: 'Dairy',
    unit: 'liters',
    price: 2.50,
    supplier: 'Local Farm Co.',
    reorderLevel: 50,
    onHand: 120,
    isActive: true,
    expiryDate: new Date('2024-12-31')
  },
  {
    _id: '2',
    name: 'Greek Yogurt',
    sku: 'GY002',
    category: 'Dairy',
    unit: 'containers',
    price: 4.99,
    supplier: 'Dairy Fresh Ltd.',
    reorderLevel: 30,
    onHand: 45,
    isActive: true,
    expiryDate: new Date('2024-11-15')
  },
  {
    _id: '3',
    name: 'Cheddar Cheese',
    sku: 'CC003',
    category: 'Dairy',
    unit: 'kg',
    price: 12.99,
    supplier: 'Cheese Masters',
    reorderLevel: 20,
    onHand: 15,
    isActive: true,
    expiryDate: new Date('2025-02-28')
  }
];

export const mockRawMaterials = [
  {
    _id: '1',
    name: 'Cattle Feed Premium',
    sku: 'CF001',
    category: 'Feed',
    unit: 'kg',
    unitCost: 45.00,
    supplier: 'Agricultural Supplies Inc.',
    currentStock: 500,
    minimumStock: 100,
    storageLocation: 'Warehouse A',
    storageConditions: {
      temperature: 'Room Temperature',
      humidity: 'Low',
      lightConditions: 'Dark'
    },
    isActive: true,
    batchNumber: 'CF2024001',
    expiryDate: new Date('2025-06-30')
  },
  {
    _id: '2',
    name: 'Vitamin Supplements',
    sku: 'VS002',
    category: 'Supplements',
    unit: 'bottles',
    unitCost: 25.50,
    supplier: 'VetMed Solutions',
    currentStock: 80,
    minimumStock: 25,
    storageLocation: 'Medicine Storage',
    storageConditions: {
      temperature: 'Climate Controlled',
      humidity: 'Controlled',
      lightConditions: 'UV Protected'
    },
    isActive: true,
    batchNumber: 'VS2024002',
    expiryDate: new Date('2026-12-31')
  },
  {
    _id: '3',
    name: 'Cleaning Disinfectant',
    sku: 'CD003',
    category: 'Cleaning',
    unit: 'liters',
    unitCost: 15.75,
    supplier: 'Hygiene Pro Ltd.',
    currentStock: 30,
    minimumStock: 40,
    storageLocation: 'Chemical Storage',
    storageConditions: {
      temperature: 'Room Temperature',
      humidity: 'Low',
      lightConditions: 'Normal Light'
    },
    isActive: true,
    batchNumber: 'CD2024003',
    expiryDate: new Date('2025-09-30')
  },
  {
    _id: '4',
    name: 'Milking Equipment Lubricant',
    sku: 'ME004',
    category: 'Equipment',
    unit: 'bottles',
    unitCost: 35.99,
    supplier: 'Dairy Tech Solutions',
    currentStock: 12,
    minimumStock: 15,
    storageLocation: 'Equipment Room',
    storageConditions: {
      temperature: 'Room Temperature',
      humidity: 'Medium',
      lightConditions: 'Normal Light'
    },
    isActive: true,
    batchNumber: 'ME2024004',
    expiryDate: new Date('2025-12-31')
  }
];

export const mockMilkCollections = [
  {
    _id: '1',
    date: new Date(),
    farmerId: 'F001',
    farmerName: 'John Smith',
    quantity: 150.5,
    quality: 'Grade A',
    fatContent: 3.8,
    price: 0.85,
    totalAmount: 127.93
  },
  {
    _id: '2',
    date: new Date(Date.now() - 86400000), // Yesterday
    farmerId: 'F002',
    farmerName: 'Mary Johnson',
    quantity: 200.0,
    quality: 'Grade A',
    fatContent: 4.1,
    price: 0.90,
    totalAmount: 180.00
  }
];

export const mockOrders = [
  {
    _id: '1',
    orderNumber: 'ORD001',
    customerName: 'City Supermarket',
    products: [
      { productId: '1', name: 'Whole Milk', quantity: 50, price: 2.50 },
      { productId: '2', name: 'Greek Yogurt', quantity: 20, price: 4.99 }
    ],
    totalAmount: 224.80,
    status: 'pending',
    orderDate: new Date(),
    deliveryDate: new Date(Date.now() + 86400000) // Tomorrow
  }
];
