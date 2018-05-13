const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');

const USER1_ID = new ObjectID();
const USER2_ID = new ObjectID();

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

const populateTodos = (done) => {
  // Delete all todos.
  Todo.remove({}).then(() => {
    // Insert todos.
    return Todo.insertMany(TODOS);
  }).then(() => done());
};

module.exports = { TODOS, populateTodos };

