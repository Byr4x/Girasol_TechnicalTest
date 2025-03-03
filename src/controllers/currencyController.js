const currencyService = require('../services/currencyService');
const Conversion = require('../models/conversion');
const { getUserId } = require('../utils/userIdManager');

/**
 * Currency conversion controller
 * Handles currency conversion requests and stores the conversion history
 * Now includes automatic user identification for tracking individual user's conversions
 */
exports.convertCurrency = async (req, res) => {
  try {
    const { amount, from, to } = req.body;
    // Get or create unique user identifier from local storage
    const userId = getUserId();

    // Validate required fields
    if (!amount || !from || !to) {
      return res.status(400).json({ error: 'Amount, from and to currencies are required' });
    }

    // Get conversion from service
    const conversion = await currencyService.convertCurrency(amount, from, to);
    
    // Store conversion in database with user identification
    await Conversion.create({
      userId, 
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
 * Returns the last 5 currency conversions for the specific user
 * Uses automatic user identification to filter results
 */
exports.getHistory = async (req, res) => {
  try {
    // Get user's unique identifier
    const userId = getUserId();
    
    // Fetch only conversions associated with this user
    const history = await Conversion.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 