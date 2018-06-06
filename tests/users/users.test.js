const expect = require('expect');
const request = require('supertest');

const { populateUsers, destory } = require('./../seeds/users');
const { app, shutdown } = require('./../../server/server');

before(populateUsers);


// POST /users
describe('POST /users', () => {

  it('should create a user with valid parameters', (done) => {
    done();
  });

});

// Destory the seed data and shutdown server
after(destory);

after(function(done){
  shutdown(done);
})
