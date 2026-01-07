const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*', // For now, allowing all to debug. Ideally set to Vercel URL later.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/forms', require('./routes/forms'));

app.get('/', (req, res) => res.send({ status: 'ok', message: 'Dynova backend running' }));

app.get('/api/health', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: isConnected ? 'healthy' : 'degraded',
    database: isConnected ? 'connected' : 'disconnected',
    env: {
      hasMongoUri: !!process.env.MONGO_URI,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
