const expect = require('expect');
const { ObjectID } = require('mongodb');
const request = require('supertest');

const { app } = require('./../../server');
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const { TODOS, USERS, populateTodos, populateUsers } = require('./../seeds/seeds');

beforeEach(populateUsers);
beforeEach(populateTodos);

// POST /todos
describe('POST /todos', () => {
  it('should create a todo with valid parameters', (done) => {
    const TEXT = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', USERS[0].tokens[0].token)
      .send({text: TEXT})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(TEXT);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text: TEXT}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(TEXT);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a todo with invalid parameters', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', USERS[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

// GET /todos
describe('GET /todos', () => {
  it('should fetch all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

// GET /todos/:id
describe('GET /todos/:id', () => {
  it('should fetch the todo', (done) => {
    request(app)
      .get(`/todos/${TODOS[0]._id.toHexString()}`)
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(TODOS[0].text);
      })
      .end(done);
  });

  it('should not return a todo that belongs to another user', (done) => {
    request(app)
      .get(`/todos/${TODOS[1]._id.toHexString()}`)
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-valid todo ID', (done) => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', USERS[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

// DELETE /todos/:id
describe('DELETE /todos/:id', () => {
  it('should delete the todo', (done) => {
    const TODO_ID = TODOS[1]._id.toHexString();

    request(app)
      .delete(`/todos/${TODO_ID}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(TODO_ID);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(TODO_ID).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not delete a todo that belongs to another user', (done) => {
    const TODO_ID = TODOS[0]._id.toHexString();

    request(app)
      .delete(`/todos/${TODO_ID}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(TODO_ID).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-valid todo ID', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', USERS[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

// PATCH /todos/:id
describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    const TODO_ID = TODOS[1]._id.toHexString();
    const NEW_TEXT = 'A text';

    request(app)
      .patch(`/todos/${TODO_ID}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .send({text: NEW_TEXT, completed: true})
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(TODO_ID).then((todo) => {
          expect(todo.text).toBe(NEW_TEXT);
          expect(todo.completed).toBe(true);
          expect(typeof todo.completedAt).toBe('number');
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not update a todo that belong to another user', (done) => {
    const TODO_ID = TODOS[0]._id.toHexString();
    const NEW_TEXT = 'A text';

    request(app)
      .patch(`/todos/${TODO_ID}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .send({text: NEW_TEXT, completed: true})
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when the todo is no completed', (done) => {
    const TODO_ID = TODOS[1]._id.toHexString();
    const NEW_TEXT = 'Another text';

    request(app)
      .patch(`/todos/${TODO_ID}`)
      .set('x-auth', USERS[1].tokens[0].token)
      .send({text: NEW_TEXT, completed: false})
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(TODO_ID).then((todo) => {
          expect(todo.text).toBe(NEW_TEXT);
          expect(todo.completed).toBe(false);
          expect(todo.completedAt).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });
});
