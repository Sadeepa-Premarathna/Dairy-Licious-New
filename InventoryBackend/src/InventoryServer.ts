import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './db';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));

app.get('/api/health', (req: Request, res: Response) => 
  res.json({ ok: true, message: 'Server is running with TypeScript!' })
);

// Mock data endpoints
app.get('/api/products/mock', (req: Request, res: Response) => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Fresh Milk',
      sku: 'MILK-001',
      category: 'Dairy',
      price: 2.50,
      onHand: 100,
      reorderLevel: 20
    }
  ];
  res.json(mockProducts);
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  const status = (err as any).status || 500;
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
    console.log(`🚀 TypeScript API server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}
