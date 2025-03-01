const Redis = require('redis');

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL
});

// Handle connection events to verify Redis is working
redisClient.on('ready', () => {
  console.log('Redis is ready to receive commands');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('end', () => {
  console.log('Redis connection closed');
});

// Try to connect to Redis
redisClient.connect()
  .then(() => console.log('Redis connection established'))
  .catch(err => console.error('Error connecting to Redis:', err));

module.exports = redisClient;