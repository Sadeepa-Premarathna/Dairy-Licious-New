import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './db.js';

import productsRouter from './routes/products.js';
import inventoryRouter from './routes/inventory.js';
import ordersRouter from './routes/orders.js';
import milkRouter from './routes/milk.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/products', productsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/milk', milkRouter);
app.use('/api/dashboard', dashboardRouter);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });


