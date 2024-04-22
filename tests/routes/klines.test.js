const request = require('supertest');
const express = require('express');
const router = require('../../routes/klines');
const app = express();

app.use(express.json());
app.use('/', router);

describe('GET /', () => {
  test('should return default klines if no query parameters provided', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body.klines.length).toBeGreaterThan(0); // Assuming default klines are returned
    expect(response.body.page.limit).toBe(1000);
    expect(response.body.page.offset).toBe(0);
  });

  test('should return klines with provided limit and offset', async () => {
    const response = await request(app)
      .get('/')
      .query({ limit: 10, offset: 5 });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body.klines.length).toBeGreaterThan(0);
    expect(response.body.page.limit).toBe(10);
    expect(response.body.page.offset).toBe(5);
  });
});
