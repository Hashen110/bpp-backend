const request = require('supertest');
const express = require('express');
const router = require('../../routes/ticker');
const app = express();

app.use('/', router);

describe('GET /24hr', () => {
  test('should return ticker data if request to external service is successful', async () => {
    const response = await request(app)
      .get('/24hr');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });
});

describe('GET /price', () => {
  test('should return ticker data if request to external service is successful', async () => {
    const response = await request(app)
      .get('/price');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
  });
});
