const axios = require('axios');

/**
 * Currency Service
 * Handles currency conversion operations using Open Exchange Rates API
 */
class CurrencyService {
  constructor() {
    this.API_KEY = process.env.OPEN_EXCHANGE_RATES_API_KEY;
    this.BASE_URL = 'https://openexchangerates.org/api/latest.json';
  }

  /**
   * Get current exchange rates from API
   * @returns {Promise<Object>} Exchange rates with USD as base
   */
  async getRates() {
    try {
      const response = await axios.get(`${this.BASE_URL}?app_id=${this.API_KEY}`);
      return response.data.rates;
    } catch (error) {
      throw new Error('Error fetching exchange rates');
    }
  }

  /**
   * Convert amount between currencies
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency code
   * @param {string} toCurrency - Target currency code
   * @returns {Promise<Object>} Conversion result and rate
   */
  async convertCurrency(amount, fromCurrency, toCurrency) {
    const rates = await this.getRates();
    
    // Convert to USD first (base currency)
    const amountInUSD = fromCurrency === 'USD' 
      ? amount 
      : amount / rates[fromCurrency];
    
    // Convert from USD to target currency
    const result = toCurrency === 'USD' 
      ? amountInUSD 
      : amountInUSD * rates[toCurrency];
    
    return {
      result: Number(result.toFixed(2)),
      rate: rates[toCurrency] / rates[fromCurrency]
    };
  }
}

module.exports = new CurrencyService();