const mongoose = require('mongoose');

/**
 * Conversion Schema
 * Stores currency conversion records with:
 * - User ID
 * - Source currency
 * - Target currency
 * - Original amount
 * - Converted result
 * - Exchange rate used
 * - Timestamp of conversion
 */
const conversionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  fromCurrency: String,
  toCurrency: String,
  amount: Number,
  result: Number,
  rate: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Conversion', conversionSchema); 