const express = require('express');

const { isBlank } = require('../utils');
const { execute } = require('../utils/database');
const logger = require('../utils/logger')(__filename);

const router = express.Router();

router.get('/', async (req, res) => {
  let { limit, offset } = req.query;

  if (isBlank(limit)) {
    limit = 1000;
  }
  if (isBlank(offset)) {
    offset = 0;
  }

  try {
    limit = Number.parseInt(limit, 10);
    offset = Number.parseInt(offset, 10);

    if (limit > 1000 || Number.isNaN(limit)) {
      limit = 1000;
    }
    if (offset < 0 || Number.isNaN(offset)) {
      offset = 0;
    }
  } catch (e) {
    logger.error(e);
    return res.sendStatus(400);
  }

  try {
    const { rows } = await execute('SELECT * FROM klines ORDER BY openTime DESC LIMIT ? OFFSET ?', [limit, offset]);
    return res.json({
      klines: rows.map((row) => ({
        close: ((Number.parseFloat(row.closePrice) + Number.EPSILON) * 100) / 100,
        high: ((Number.parseFloat(row.highPrice) + Number.EPSILON) * 100) / 100,
        low: ((Number.parseFloat(row.lowPrice) + Number.EPSILON) * 100) / 100,
        open: ((Number.parseFloat(row.openPrice) + Number.EPSILON) * 100) / 100,
        timestamp: row.openTime,
        volume: Number.parseInt(row.volume, 10),
      })),
      page: { limit, offset },
    });
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
