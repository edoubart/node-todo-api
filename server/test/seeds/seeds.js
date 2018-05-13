const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const USER1_ID = new ObjectID();
const USER2_ID = new ObjectID();

const USERS = [
  {
    _id: USER1_ID,
    email: 'edouard.barthelemy+1@gmail.com',
    password: 'P@ssw0rd1!',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: USER1_ID, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: USER2_ID,
    email: 'edouard.barthelemy+2@gmail.com',
    password: 'P@ssw0rd2!',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: USER2_ID, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
];

const TODOS = [
  {
    _id: new ObjectID(),
    text: 'First todo',
    _creator: USER1_ID
  },
  {
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 333,
    _creator: USER2_ID
  }
];

const populateUsers = (done) => {
  // Delete all users.
  User.remove({}).then(() => {
    // Create users.
    var user1 = new User(USERS[0]).save();
    var user2 = new User(USERS[1]).save();

    return Promise.all([user1, user2]);
  }).then(() => done());
};

const populateTodos = (done) => {
  // Delete all todos.
  Todo.remove({}).then(() => {
    // Insert todos.
    return Todo.insertMany(TODOS);
  }).then(() => done());
};

module.exports = { TODOS, USERS, populateTodos, populateUsers };
