const axios = require('axios');
const redisClient = require('../config/redis'); // Import Redis configuration

/**
 * Currency Service
 * Handles currency conversion operations using Open Exchange Rates API
 * Now includes Redis caching to reduce API calls and improve performance.
 */
class CurrencyService {
  constructor() {
    this.API_KEY = process.env.OPEN_EXCHANGE_RATES_API_KEY;
    this.BASE_URL = 'https://openexchangerates.org/api/latest.json';
    this.CACHE_KEY = process.env.REDIS_URL
    this.CACHE_EXPIRATION = 3600; // Cache expiration time in seconds (1 hour)
  }

  /**
   * Get current exchange rates from API or Redis cache
   * First, check if rates are available in Redis to avoid unnecessary API calls.
   * If not found in cache, fetch from API and store in Redis.
   * @returns {Promise<Object>} Exchange rates with USD as base
   */
  async getRates() {
    try {
      // Try to retrieve exchange rates from Redis cache
      const cachedRates = await redisClient.get(this.CACHE_KEY);

      if (cachedRates) {
        console.log('Using cached exchange rates');
        return JSON.parse(cachedRates); // Parse JSON string back to an object
      }

      // If cache is empty, fetch data from the API
      console.log('Fetching exchange rates from API');
      const response = await axios.get(`${this.BASE_URL}?app_id=${this.API_KEY}`);
      const rates = response.data.rates;

      // Store the fetched exchange rates in Redis with an expiration time
      await redisClient.set(this.CACHE_KEY, JSON.stringify(rates), { EX: this.CACHE_EXPIRATION });

      return rates;
    } catch (error) {
      throw new Error('Error fetching exchange rates');
    }
  }

  /**
   * Convert amount between currencies
   * Retrieves exchange rates (from cache or API) and performs currency conversion.
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency code (e.g., "USD")
   * @param {string} toCurrency - Target currency code (e.g., "EUR")
   * @returns {Promise<Object>} Conversion result and exchange rate used
   */
  async convertCurrency(amount, fromCurrency, toCurrency) {
    const rates = await this.getRates();

    // Ensure provided currency codes exist in exchange rates data
    if (!rates[fromCurrency] || !rates[toCurrency]) {
      throw new Error('Invalid currency codes');
    }

    // Convert to USD first (base currency)
    const amountInUSD = fromCurrency === 'USD' 
      ? amount 
      : amount / rates[fromCurrency];

    // Convert from USD to target currency
    const result = toCurrency === 'USD' 
      ? amountInUSD 
      : amountInUSD * rates[toCurrency];

    return {
      result: Number(result.toFixed(2)), // Round to 2 decimal places
      rate: rates[toCurrency] / rates[fromCurrency] // Provide exchange rate used
    };
  }
}

module.exports = new CurrencyService();