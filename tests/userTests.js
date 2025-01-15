const request = require('supertest');
const app = require('../app');


describe('User API', () => {

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test', dob: '1990-01-01', address: '123 Street', description: 'Test user' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should get a user by ID', async () => {
    const user = await request(app)
      .post('/api/users')
      .send({ name: 'Test', dob: '1990-01-01', address: '123 Street', description: 'Test user' });
    const res = await request(app).get(`/api/users/${user.body._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', user.body._id);
  });

  it('should update a user by ID', async () => {
    const user = await request(app)
      .post('/api/users')
      .send({ name: 'Test', dob: '1990-01-01', address: '123 Street', description: 'Test user' });
    const res = await request(app)
      .put(`/api/users/${user.body._id}`)
      .send({ name: 'Updated Test', dob: '1990-01-01', address: '123 Street', description: 'Updated user' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Test');
  });

  it('should delete a user by ID', async () => {
    const user = await request(app)
      .post('/api/users')
      .send({ name: 'Test', dob: '1990-01-01', address: '123 Street', description: 'Test user' });
    const res = await request(app).delete(`/api/users/${user.body._id}`);
    expect(res.statusCode).toEqual(204);
  });

  it('should return 404 for non-existing user', async () => {
    const res = await request(app).get('/api/users/invalidID');
    expect(res.statusCode).toEqual(404);
  });

});

