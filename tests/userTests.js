const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const User = require('./src/models/userModel');

// KINDLY NOTE THAT THIS FILE HAVE NOT FULLY DEVELOPED YET
// ALL TESTS WILL BE CONDUCTED IN POSTMAN FIRST BEFORE AUTO-TEST IMPLEMENTING IT HERE

describe('User Controller', () => {

  let server;
  let userId;
  let token;

  // Step 1 - Create a new user first
  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/users')
        .send({ username: 'Tester', name: 'New User', address: 'Taman Intan Jaya', dob: '1990-01-01', password: 'newpassword123' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'New User');
    });
  });

  // Step 2 - Login a new user and obtain token
  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/users')
        .send({ name: 'New User', address: 'Taman Intan Jaya', dob: '1990-01-01', password: 'newpassword123' });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'New User');
    });
  });

  // Step 3 - Get all users
  describe('GET /api/v1/users', () => {
    it('should return all users', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // Step 4 - Get a single user by user_id
  describe('GET /api/v1/users/:id', () => {
    it('should return a single user', async () => {
      const res = await request(app).get(`/users/${userId}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test User');
    });
  });

  // Step 5 - Update an existing user by user_id
  describe('PUT /api/v1/users/:id/update', () => {
    it('should update an existing user', async () => {
      const res = await request(app)
        .put(`/users/${userId}/update`)
        .send({ name: 'Updated User' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated User');
    });
  });

  // Step 6 - Follow another existing user by user_id
  describe('POST /api/v1/users/:id/follow', () => {
    it('should follow a user', async () => {
      const targetUser = new User({ name: 'Target User', address: 'Taman Maju Jaya', dob: '1995-01-01', password: 'targetpassword123' });
      await targetUser.save();
      const res = await request(app)
        .post(`/api/v1/users/${targetUser._id}/follow`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Followed successfully');
    });
  });

  // Step 7 - Get nearby followers and followings of by user_id
  describe('GET /api/v1/users/:id/nearby', () => {
    it('should return nearby followers and followings', async () => {
      const res = await request(app).get(`/api/v1/users/${userId}/nearby`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('nearbyFollowers');
      expect(res.body).toHaveProperty('nearbyFollowings');
    });
  });

  // Step 8 - Unfollow a followed existing user by user_id
  describe('POST /api/v1/users/:id/unfollow', () => {
    it('should unfollow a user', async () => {
      const targetUser = new User({ name: 'Target User', address: 'Taman Maju Jaya', dob: '1995-01-01', password: 'targetpassword123' });
      await targetUser.save();
      await User.findByIdAndUpdate(userId, { $addToSet: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $addToSet: { followers: userId } });
      const res = await request(app)
        .post(`/api/v1/users/${targetUser._id}/unfollow`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Unfollowed successfully');
    });
  });

  // Step 9 - Delete an existing user by user_id
  describe('DELETE /api/v1/users/:id/remove', () => {
    it('should delete a user', async () => {
      const res = await request(app).delete(`/users/${userId}/remove`);
      expect(res.status).toBe(204);
    });
  });

});