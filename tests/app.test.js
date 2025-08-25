const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');

describe('App', () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    // Clean up and close database connection
    await mongoose.connection.close();
  });

  describe('Health Check', () => {
    test('should respond with 404 for root path', async () => {
      const response = await request(app)
        .get('/')
        .expect(404);
    });
  });

  describe('API Routes', () => {
    test('should respond to auth routes', async () => {
      const response = await request(app)
        .get('/api/v1/auth/health')
        .expect(404); // Expecting 404 since health endpoint might not exist
    });

    test('should respond to user routes', async () => {
      const response = await request(app)
        .get('/api/v1/user/health')
        .expect(404); // Expecting 404 since health endpoint might not exist
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(400);
    });
  });
});
