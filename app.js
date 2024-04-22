const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const actuator = require('express-actuator');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const authRouter = require('./routes/auth');
const tickerRouter = require('./routes/ticker');
const usersRouter = require('./routes/users');
const klinesRouter = require('./routes/klines');
const pricesRouter = require('./routes/prices');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.disable('x-powered-by');
app.use(compression());
app.use(actuator());
app.use(cors());

app.use('/auth', authRouter);
app.use(async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.sendStatus(401);
    }
    const decoded = jwt.verify(authorization.substr(7), process.env.ACCESS_TOKEN_SECRET, {
      issuer: 'bpp-backend',
      audience: 'bpp-frontend',
    });
    req.user = decoded.user;
    return next();
  } catch (e) {
    return res.sendStatus(401);
  }
});
app.use('/klines', klinesRouter);
app.use('/ticker', tickerRouter);
app.use('/users', usersRouter);
app.use('/prices', pricesRouter);

module.exports = app;
