const expect = require('expect');
const { ObjectID } = require('mongodb');
const request = require('supertest');

const { app } = require('./../../server');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { TODOS, USERS, populateTodos, populateUsers } = require('./../seeds/seeds');

beforeEach(populateUsers);
beforeEach(populateTodos);

// POST /users
describe('POST /users', () => {
  it('should create a user with valid parameters', (done) => {
    const EMAIL = 'example@example.com';
    const PASSWORD = 'P@ssw0rd!';

    request(app)
      .post('/users')
      .send({email: EMAIL, password: PASSWORD})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(EMAIL);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email: EMAIL}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(PASSWORD);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a user with invalid parameters', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'example@example',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create a user if the email is already taken', (done) => {
    request(app)
      .post('/users')
      .send({
        email: USERS[0].email,
        password: 'P@ssw0rd!'
      })
      .expect(400)
      .end(done);
  });
});

// GET /users/me
describe('GET /users/me', () => {
  it('should return the current user if logged-in', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(USERS[0]._id.toHexString());
        expect(res.body.email).toBe(USERS[0].email);
      })
      .end(done);
  });

  it('should return 401 if the current user is not logged-id', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

// POST /users/login
describe('POST /users/login', () => {
  it('should login the user with valid parameters and return authentication token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: USERS[1].email,
        password: USERS[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(USERS[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject the user with invalid parameters', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: USERS[1].email,
        password: USERS[1].password + 1
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(USERS[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

// DELETE /users/me/token
describe('DELETE /users/me/token', () => {
  it('should delete the authentication token of the current logged-in user', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(USERS[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
