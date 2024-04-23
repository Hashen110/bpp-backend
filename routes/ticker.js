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
      priceChange: '137.61000000',
      priceChangePercent: '0.208',
      weightedAvgPrice: '66387.68123107',
      prevClosePrice: '66009.99000000',
      lastPrice: '66147.61000000',
      lastQty: '0.00596000',
      bidPrice: '66147.60000000',
      bidQty: '2.38174000',
      askPrice: '66147.61000000',
      askQty: '8.94203000',
      openPrice: '66010.00000000',
      highPrice: '67232.35000000',
      lowPrice: '65626.87000000',
      volume: '24156.25727000',
      quoteVolume: '1603677907.37654610',
      openTime: 1713781739659,
      closeTime: 1713868139659,
      firstId: 3569153621,
      lastId: 3570589944,
      count: 1436324,
    });
  }
});

router.get('/price', async (_, res) => {
  try {
    const response = await client.tickerPrice('BTCUSDT');
    return res.json(response.data);
  } catch (e) {
    logger.error(e);
    return res.json({ symbol: 'BTCUSDT', price: '66147.61000000' });
  }
});

module.exports = router;
