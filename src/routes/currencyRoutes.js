const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

/**
 * Currency conversion routes
 * POST /convert - Convert between currencies
 * GET /history - Get last 5 conversions
 */
router.post('/convert', currencyController.convertCurrency);
router.get('/history', currencyController.getHistory);

module.exports = router; 