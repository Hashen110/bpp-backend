const request = require('supertest');
const express = require('express');
const router = require('../../routes/users');
const app = express();

app.use('/', router);

describe('GET /', () => {
  test('should return users data if database query is successful', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('count');

    // Check if users array is not empty
    expect(Array.isArray(response.body.users)).toBeTruthy();
    expect(response.body.users.length).toBeGreaterThan(0);

    // Check if each user object does not contain password field
    response.body.users.forEach(user => {
      expect(user).not.toHaveProperty('password');
    });

    // Check if count is equal to the number of users returned
    expect(response.body.count).toBe(response.body.users.length);
  });
});

describe('GET /:id', () => {
  test('should return user data if user exists', async () => {
    const response = await request(app)
      .get('/1');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).not.toHaveProperty('password');
  });

  test('should return 404 if user does not exist', async () => {
    const response = await request(app)
      .get('/999');

    expect(response.status).toBe(404);
  });
});
