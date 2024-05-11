const express = require('express');

const { client } = require('../utils/binance');
const logger = require('../utils/logger')(__filename);

const router = express.Router();

router.get('/24hr', async (_, res) => {
  try {
    const response = await client.ticker24hr('BTCUSDT');
    return res.json(response.data);
  } catch (e) {
    logger.error(e);
    return res.json({
      symbol: 'BTCUSDT',
      openPrice: Math.round(Math.random() * (65000 - 60000) + 60000 * 100) / 100,
      highPrice: Math.round(Math.random() * (65000 - 60000) + 60000 * 100) / 100,
      lowPrice: Math.round(Math.random() * (65000 - 60000) + 60000 * 100) / 100,
      volume: Math.round(Math.random() * (32500 - 30000) + 30000 * 100) / 100,
    });
  }
});

router.get('/price', async (_, res) => {
  try {
    const response = await client.tickerPrice('BTCUSDT');
    return res.json(response.data);
  } catch (e) {
    logger.error(e);
    return res.json({ symbol: 'BTCUSDT', price: Math.round(Math.random() * (65000 - 60000) + 60000 * 100) / 100 });
  }
});

module.exports = router;
