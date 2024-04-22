const { Spot } = require('@binance/connector');

const client = new Spot(process.env.API_KEY, process.env.API_SECRET);

module.exports = { client };
