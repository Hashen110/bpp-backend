const { isBlank } = require('../../utils');

describe('isBlank', () => {
  test('should return true for null or undefined', () => {
    expect(isBlank(null)).toBe(true);
    expect(isBlank(undefined)).toBe(true);
  });

  test('should return true for empty string or whitespace string', () => {
    expect(isBlank('')).toBe(true);
    expect(isBlank('   ')).toBe(true);
  });

  test('should return false for non-empty string', () => {
    expect(isBlank('hello')).toBe(false);
  });

  test('should return true for empty array', () => {
    expect(isBlank([])).toBe(true);
  });

  test('should return false for non-empty array', () => {
    expect(isBlank([1, 2, 3])).toBe(false);
  });

  test('should return true for empty object', () => {
    expect(isBlank({})).toBe(true);
  });

  test('should return false for non-empty object', () => {
    expect(isBlank({ key: 'value' })).toBe(false);
  });

  test('should return false for numbers', () => {
    expect(isBlank(0)).toBe(false);
    expect(isBlank(123)).toBe(false);
    expect(isBlank(-1)).toBe(false);
    expect(isBlank(0.5)).toBe(false);
  });

  test('should return false for booleans', () => {
    expect(isBlank(true)).toBe(false);
    expect(isBlank(false)).toBe(false);
  });

  test('should return false for functions', () => {
    expect(isBlank(() => {})).toBe(false);
  });

  test('should return false for symbols', () => {
    expect(isBlank(Symbol())).toBe(false);
  });
});
