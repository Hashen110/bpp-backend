const logger = require('../../utils/logger');

describe('Logger', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    console.debug = jest.fn(); // Mock console.debug
    console.info = jest.fn(); // Mock console.info
    console.error = jest.fn(); // Mock console.error
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should log debug message in development environment with DEBUG=true', () => {
    process.env.NODE_ENV = 'development';
    process.env.DEBUG = 'true';

    const log = logger('example.js');
    log.debug('Debug message');

    expect(console.debug).toHaveBeenCalledWith('[undefined/example.js][DEBUG] Debug message');
  });

  test('should not log debug message in production environment', () => {
    process.env.NODE_ENV = 'production';
    process.env.DEBUG = 'true';

    const log = logger('example.js');
    log.debug('Debug message');

    expect(console.debug).not.toHaveBeenCalled();
  });

  test('should log error message', () => {
    const log = logger('example.js');
    log.error('Error message');

    expect(console.error).toHaveBeenCalledWith('[undefined/example.js][ERROR] Error message');
  });

  test('should log info message', () => {
    const log = logger('example.js');
    log.info('Info message');

    expect(console.info).toHaveBeenCalledWith('[undefined/example.js][INFO] Info message');
  });

  test('should log log message', () => {
    const log = logger('example.js');
    log.log('Log message');

    expect(console.log).toHaveBeenCalledWith('[undefined/example.js][LOG] Log message');
  });
});
