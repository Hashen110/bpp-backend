/**
 * @file Manages common utils for the service
 * @author Hashen Abeysekara <hashen.abeysekara123@gmail.com>
 */

/**
 * Check if the given data is blank
 * @param {*} data
 * @returns {boolean}
 */
function isBlank(data) {
  if (data === null || data === undefined) {
    return true;
  }
  if (typeof data === 'string') {
    return data.trim().length === 0;
  }
  if (Array.isArray(data)) {
    return data.length === 0;
  }
  if (typeof data === 'object') {
    return Object.keys(data).length === 0;
  }
  return false;
}

module.exports = { isBlank };
