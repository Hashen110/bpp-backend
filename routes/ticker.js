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
    return res.sendStatus(500);
  }
});

router.get('/price', async (_, res) => {
  try {
    const response = await client.tickerPrice('BTCUSDT');
    return res.json(response.data);
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
