const express = require('express');
const axios = require('axios');

const { isBlank } = require('../utils');
const logger = require('../utils/logger')(__filename);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.BPP_MODEL_SERVICE_URL}/predict?pred_days=30`);
    if (response.data) {
      return res.json(response.data);
    }
    return res.sendStatus(500);
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

router.get('/price', async (req, res) => {
  const { date } = req.query;
  if (isBlank(date)) {
    return res.sendStatus(400);
  }

  // calculate date difference from 2024-04-15 to provided date
  const diff = Math.floor((new Date(date) - new Date('2024-04-15')) / (1000 * 60 * 60 * 24));
  try {
    const response = await axios.get(`${process.env.BPP_MODEL_SERVICE_URL}/predict?pred_days=${diff}`);
    if (response.data) {
      return res.json({
        date,
        price: response.data.predictions[response.data.predictions.length - 1],
      });
    }
    return res.sendStatus(500);
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
