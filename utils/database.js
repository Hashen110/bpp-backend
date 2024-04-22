/**
 * @file Manages database using mysql2 library
 * @author Hashen Abeysekara <hashen.abeysekara123@gmail.com>
 */

const mysql = require('mysql2/promise');
const utils = require('./index');
const logger = require('./logger')(__filename);

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST.trim(),
  port: parseInt(process.env.DATABASE_PORT.trim(), 10),
  user: process.env.DATABASE_USER.trim(),
  password: process.env.DATABASE_PASSWORD.trim(),
  database: process.env.DATABASE_NAME.trim(),
  multipleStatements: true,
  waitForConnections: true,
});

/**
 * Execute query
 * @param {{sql: string, values: Array, rowsAsArray: boolean}} data
 * @returns {Promise<*>}
 * @private
 */
async function query(data) {
  if (process.env.DATABASE_SHOW_SQL === true || process.env.DATABASE_SHOW_SQL === 'true') {
    if (utils.isBlank(data.values)) {
      logger.debug(data.sql);
    } else {
      logger.debug(data.sql, data.values);
    }
  }
  return pool.query(data);
}

/**
 * Execute database query
 * @param {string} sql - SQL query
 * @param {Array} [values] - SQL query params
 * @param {boolean} [rowsAsArray] - Rows as an array
 * @returns {Promise<{rows: Array.<Object>, rowCount: number}>}
 */
async function execute(sql, values, rowsAsArray = false) {
  const [rows] = await query({ sql, values, rowsAsArray });
  return { rows, rowCount: rows.length };
}

/**
 * Execute database insert query
 * @param {string} sql - SQL query
 * @param {Array} [values] - SQL query params
 * @param {boolean} [rowsAsArray] - Rows as an array
 * @returns {Promise<{fieldCount: number, affectedRows: number, insertId: number, info: string}>}
 */
async function executeInsert(sql, values, rowsAsArray = false) {
  const [data] = await query({ sql, values, rowsAsArray });
  return { fieldCount: data.fieldCount, affectedRows: data.affectedRows, insertId: data.insertId, info: data.info };
}

/**
 * Escape SQL query params
 * @param value
 * @returns {string}
 */
function escape(value) {
  return pool.escape(value);
}

module.exports = { execute, executeInsert, escape };
