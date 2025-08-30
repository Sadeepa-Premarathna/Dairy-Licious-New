import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import AdditionalExpensesRoutes from './Routes/AdditionalExpensesRoutes.js';
import AllowanceRoutes from './Routes/AllowanceRoutes.js';

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use('/api/additional-expenses', AdditionalExpensesRoutes);
app.use('/api/allowances', AllowanceRoutes);

if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI environment variable. Create a .env file with MONGODB_URI.");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
      console.log("Connected to MongoDB");
      app.listen(process.env.PORT || 8000, () => {
          console.log(`Server running on http://localhost:${process.env.PORT || 8000}`);
      });
  })
  .catch((err) => console.log(err));
