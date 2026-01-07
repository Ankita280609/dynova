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

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log('DB not connected, attempting to connect...');
    await connectDB();
  }
  next();
});

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
  const mongoUri = process.env.MONGO_URI || "";

  // Mask the password for security
  let maskedUri = "Not Set";
  if (mongoUri) {
    maskedUri = mongoUri.replace(/\/\/.*:.*@/, "//user:****@");
  }

  res.json({
    status: isConnected ? 'healthy' : 'degraded',
    database: isConnected ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    env: {
      hasMongoUri: !!process.env.MONGO_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      uriFormat: maskedUri
    }
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
