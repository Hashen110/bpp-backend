const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = require('../../routes/auth');
const { execute } = require('../../utils/database');
const app = express();

app.use(express.json());
app.use('/', router);

beforeEach(async () => {
  await execute('DELETE FROM tokens');
});

describe('POST /login', () => {
  test('should return 400 if username or password is blank', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: '', password: 'somepassword' });

    expect(response.status).toBe(400);
  });

  test('should return 400 if username or password is missing', async () => {
    const response = await request(app)
      .post('/login')
      .send({ password: 'somepassword' });

    expect(response.status).toBe(400);
  });

  test('should return 400 if user not found', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'nonexistentuser', password: 'somepassword' });

    expect(response.status).toBe(400);
  });

  test('should return tokens if login successful', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'hashen', password: 'hashen' });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});

describe('POST /register', () => {
  test('should return 400 if any required field is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        // Password is missing here
      });

    expect(response.status).toBe(400);
  });

  test('should return 409 if username or email already exists', async () => {
    // Assuming the username 'existinguser' or email 'existingemail@example.com' already exists in the database
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'existingemail@example.com',
        username: 'existinguser',
        password: 'somepassword',
      });

    expect(response.status).toBe(409);
  });

  test('should register successfully and return tokens', async () => {
    await execute('DELETE FROM users WHERE username = ?', ['johndoe']);
    // Assuming the registration is successful
    const response = await request(app)
      .post('/register')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'somepassword',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});

describe('POST /refresh', () => {
  test('should return 400 if grantType is not refreshToken', async () => {
    const response = await request(app)
      .post('/refresh')
      .send({
        refreshToken: 'someRefreshToken',
        grantType: 'invalidGrantType', // Setting invalid grantType
      });

    expect(response.status).toBe(400);
  });

  test('should return 401 if refreshToken is invalid', async () => {
    const invalidRefreshToken = jwt.sign({ user: { id: 123, email: 'test@example.com', username: 'testuser' } }, 'invalidSecret');
    const response = await request(app)
      .post('/refresh')
      .send({
        refreshToken: invalidRefreshToken,
        grantType: 'refreshToken',
      });

    expect(response.status).toBe(401);
  });

  test('should refresh tokens successfully', async () => {
    const validRefreshToken = jwt.sign({
      iss: 'bpp-backend',
      aud: 'bpp-frontend',
      sub: 'hashen',
      exp: Math.floor(Date.now() / 1000) + 604800, // 1 week
      nbf: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
      user: { id: 1, email: 'hashen@gmail.com', username: 'hashen' },
    }, process.env.REFRESH_TOKEN_SECRET);

    const response = await request(app)
      .post('/refresh')
      .send({
        refreshToken: validRefreshToken,
        grantType: 'refreshToken',
      });

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});

describe('GET /me', () => {
  test('should return 401 if authorization header is missing', async () => {
    const response = await request(app)
      .get('/me');

    expect(response.status).toBe(401);
  });

  test('should return user data if token is valid', async () => {
    const accessToken = jwt.sign({
      iss: 'bpp-backend',
      aud: 'bpp-frontend',
      sub: 'hashen',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      nbf: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
      user: { id: 1, email: 'hashen@gmail.com', username: 'hashen' },
    }, process.env.ACCESS_TOKEN_SECRET);
    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).not.toHaveProperty('password'); // Ensure password is not returned
  });

  test('should return 401 if token is invalid', async () => {
    const invalidToken = 'invalidAccessToken';
    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
  });

  test('should return 401 if token is expired', async () => {
    const expiredToken = jwt.sign({ user: { id: 123 } }, 'invalidSecret', { expiresIn: 0 });
    const response = await request(app)
      .get('/me')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
  });
});
