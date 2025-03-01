const currencyService = require('../services/currencyService');
const Conversion = require('../models/conversion');

/**
 * Currency conversion controller
 * Handles currency conversion requests and stores the conversion history
 */
exports.convertCurrency = async (req, res) => {
  try {
    const { amount, from, to } = req.body;

    // Validate required fields
    if (!amount || !from || !to) {
      return res.status(400).json({ error: 'Amount, from and to currencies are required' });
    }

    // Get conversion from service
    const conversion = await currencyService.convertCurrency(amount, from, to);
    
    // Store conversion in database
    await Conversion.create({
      fromCurrency: from,
      toCurrency: to,
      amount,
      result: conversion.result,
      rate: conversion.rate
    });

    // Return only conversion result and rate
    res.json({
      conversion: conversion.result,
      rate: conversion.rate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get conversion history
 * Returns the last 5 currency conversions
 */
exports.getHistory = async (req, res) => {
  try {
    const history = await Conversion.find()
      .sort({ timestamp: -1 })
      .limit(5);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 