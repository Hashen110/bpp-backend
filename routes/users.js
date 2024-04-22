const express = require('express');

const { isBlank } = require('../utils');
const { execute, executeInsert } = require('../utils/database');
const logger = require('../utils/logger')(__filename);

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const { rows, rowCount } = await execute('SELECT * FROM users');
    rows.forEach((row) => {
      delete row.password;
    });
    return res.json({ users: rows, count: rowCount });
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (isBlank(id)) {
    return res.sendStatus(400);
  }

  try {
    const { rows, rowCount } = await execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rowCount < 1) {
      return res.sendStatus(404);
    }
    delete rows[0].password;
    return res.json({ user: rows[0] });
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (isBlank(id)) {
    return res.sendStatus(400);
  }

  const { firstname, lastname } = req.body;
  if (isBlank(firstname) || isBlank(lastname)) {
    return res.sendStatus(400);
  }

  try {
    await executeInsert('UPDATE users SET firstname = ?, lastname = ? WHERE id = ?', [firstname, lastname, id]);

    const { rows, rowCount } = await execute('SELECT * FROM users WHERE id = ?', [id]);
    if (rowCount < 1) {
      return res.sendStatus(404);
    }
    delete rows[0].password;
    return res.json({ user: rows[0] });
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
