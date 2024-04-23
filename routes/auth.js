const express = require('express');
const { createHmac } = require('node:crypto');
const jwt = require('jsonwebtoken');

const { isBlank } = require('../utils');
const { execute, executeInsert } = require('../utils/database');
const logger = require('../utils/logger')(__filename);

const router = express.Router();

/**
 * Generate tokens for the user
 * @param {number} id
 * @param {string} email
 * @param {string} username
 * @returns {{accessToken: string, refreshToken: string, tokenType: string, expiresIn: number}}
 */
function generateTokens(id, email, username) {
  const accessToken = jwt.sign({
    iss: 'bpp-backend',
    aud: 'bpp-frontend',
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    nbf: Math.floor(Date.now() / 1000),
    iat: Math.floor(Date.now() / 1000),
    user: { id, email, username },
  }, process.env.ACCESS_TOKEN_SECRET);

  const refreshToken = jwt.sign({
    iss: 'bpp-backend',
    aud: 'bpp-frontend',
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 604800, // 1 week
    nbf: Math.floor(Date.now() / 1000),
    iat: Math.floor(Date.now() / 1000),
    user: { id, email, username },
  }, process.env.REFRESH_TOKEN_SECRET);

  executeInsert(
    'INSERT INTO tokens (userId, accessToken, refreshToken) VALUES (?, ?, ?)',
    [id, accessToken.split('.')[2], refreshToken.split('.')[2]],
  ).then(console.log).catch(console.error);

  return {
    accessToken,
    expiresIn: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    refreshToken,
    tokenType: 'Bearer',
  };
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (isBlank(username) || isBlank(password)) {
    return res.sendStatus(400);
  }

  try {
    const hmac = createHmac('sha256', process.env.PASSWORD_SALT);
    hmac.update(password);

    const { rows, rowCount } = await execute(
      'SELECT id, email FROM users WHERE username = ? AND password = ?',
      [username, hmac.digest('hex')],
    );

    if (rowCount < 1) {
      return res.sendStatus(400);
    }

    return res.json(generateTokens(rows[0].id, rows[0].email, username));
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

router.post('/register', async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;

  if (isBlank(firstname) || isBlank(lastname) || isBlank(email) || isBlank(username) || isBlank(password)) {
    return res.sendStatus(400);
  }

  try {
    const { rowCount } = await execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email],
    );
    if (rowCount > 0) {
      return res.sendStatus(409);
    }

    const hmac = createHmac('sha256', process.env.PASSWORD_SALT);
    hmac.update(password);
    const { insertId } = await executeInsert(
      'INSERT INTO users (firstname, lastname, email, username, password) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, email, username, hmac.digest('hex')],
    );
    return res.json(generateTokens(insertId, email, username));
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken, grantType } = req.body;

  if (grantType !== 'refreshToken') {
    return res.sendStatus(400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, {
      issuer: 'bpp-backend',
      audience: 'bpp-frontend',
    });
    return res.json(generateTokens(decoded.user.id, decoded.user.email, decoded.user.username));
  } catch (e) {
    logger.error(e);
    return res.sendStatus(401);
  }
});

router.get('/me', async (req, res) => {
  const { authorization } = req.headers;
  if (isBlank(authorization)) {
    return res.sendStatus(401);
  }

  const token = authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      issuer: 'bpp-backend',
      audience: 'bpp-frontend',
    });
    const { rows } = await execute('SELECT * FROM users WHERE id = ?', [decoded.user.id]);
    delete rows[0].password;
    return res.json(rows[0]);
  } catch (e) {
    logger.error(e);
    return res.sendStatus(401);
  }
});

module.exports = router;
