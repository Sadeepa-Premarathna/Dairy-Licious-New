import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './db.js';
import { mockProducts, mockRawMaterials, mockMilkCollections, mockOrders } from './mockData.js';

// Import routes
import productsRouter from './routes/products.js';
import inventoryRouter from './routes/inventory.js';
import ordersRouter from './routes/orders.js';
import milkRouter from './routes/milk.js';
import dashboardRouter from './routes/dashboard.js';
import rawMaterialsRouter from './routes/rawMaterials.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true, message: 'Server is running' }));

// Mock API endpoints for testing without MongoDB
app.get('/api/products/mock', (req, res) => {
  res.json(mockProducts);
});

app.get('/api/raw-materials/mock', (req, res) => {
  res.json(mockRawMaterials);
});

app.get('/api/milk/mock', (req, res) => {
  res.json(mockMilkCollections);
});

app.get('/api/orders/mock', (req, res) => {
  res.json(mockOrders);
});

app.get('/api/dashboard/mock', (req, res) => {
  const dashboardData = {
    totalProducts: mockProducts.length,
    totalRawMaterials: mockRawMaterials.length,
    lowStockProducts: mockProducts.filter(p => p.onHand <= p.reorderLevel).length,
    lowStockRawMaterials: mockRawMaterials.filter(rm => rm.currentStock <= rm.minimumStock).length,
    pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
    todayMilkCollection: mockMilkCollections
      .filter(mc => new Date(mc.date).toDateString() === new Date().toDateString())
      .reduce((sum, mc) => sum + mc.quantity, 0),
    recentOrders: mockOrders.slice(0, 5),
    recentMilkCollections: mockMilkCollections.slice(0, 5)
  };
  res.json(dashboardData);
});

// Regular routes (will work when MongoDB is connected)
app.use('/api/products', productsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/milk', milkRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/raw-materials', rawMaterialsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 8000;

// Try to connect to MongoDB, but continue even if it fails
connectDB()
  .then(() => {
    console.log('🎉 MongoDB connected successfully');
    startServer();
  })
  .catch((err) => {
    console.log('⚠️  MongoDB connection failed, using mock data mode');
    console.log('📝 Error:', err.message);
    console.log('🔄 Server will still run with mock data endpoints');
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📦 Mock products: http://localhost:${PORT}/api/products/mock`);
    console.log(`🏭 Mock raw materials: http://localhost:${PORT}/api/raw-materials/mock`);
  });
}
