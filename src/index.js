require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const currencyRoutes = require('./routes/currencyRoutes');

const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());

// Currency routes
app.use('/api/currency', currencyRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});