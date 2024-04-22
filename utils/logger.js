/**
 * @file Manages loggers
 * @author Hashen Abeysekara <hashen.abeysekara123@gmail.com>
 */

/**
 * Logger
 * @param {string} filename
 */
module.exports = (filename) => {
  const filenameSplit = filename.split('/');
  const name = `${filenameSplit.at(-2)}/${filenameSplit.at(-1)}`;

  /* eslint-disable no-console */

  return {
    debug: (message, ...optionalParams) => {
      if (process.env.NODE_ENV !== 'production') {
        if (process.env.DEBUG !== false && process.env.DEBUG !== 'false') {
          console.debug(`[${name}][DEBUG] ${message}`, ...optionalParams);
        }
      }
    },
    error: (message, ...optionalParams) => {
      console.error(`[${name}][ERROR] ${message}`, ...optionalParams);
    },
    info: (message, ...optionalParams) => {
      console.info(`[${name}][INFO] ${message}`, ...optionalParams);
    },
    log: (message, ...optionalParams) => {
      console.log(`[${name}][LOG] ${message}`, ...optionalParams);
    },
  };
};
