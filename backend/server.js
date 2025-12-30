const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/forms', require('./routes/forms'));

app.get('/', (req, res) => res.send({ status: 'ok', message: 'Dynova backend running' }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
