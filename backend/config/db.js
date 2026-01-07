const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dynova';

  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2) return mongoose.connection; // already connecting

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Wait 5s max
    });
    console.log('MongoDB connected');
    return conn;
  } catch (err) {
    console.error('MongoDB connection error detailed:', {
      message: err.message,
      name: err.name,
      code: err.code,
    });
    // Don't throw here but don't return successful conn
  }
};

module.exports = connectDB;
