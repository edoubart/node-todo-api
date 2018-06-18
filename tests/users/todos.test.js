const expect = require('expect');
const request = require('supertest');

const { beforeTest, teardown, getUser, setUser, getHeader, setHeader, UserTodo, TodoOnce, setTodo, getTodo } = require('./../seeds/todos');
const { app } = require('./../../server/server');

describe('POST /todos', () => {
  it('should create a user with valid parameters and post a new todo', (done) => {
    request(app).post('/users').send({
      email: UserTodo.email,
	    password: UserTodo.password,
	    firstName: UserTodo.firstName,
	    lastName: UserTodo.lastName
    }).expect(200).expect((res) => {
      setHeader(res.headers);
      setUser(JSON.parse(res.text));
      const user = getUser();
      expect(getHeader()['x-auth']).toBeTruthy();
      expect(user.id).toBeTruthy();
      expect(user.email).toBe(UserTodo.email);
    }).end((err) => {
      if (err) {
        return done(err);
      }
      request(app).post('/todos').send(TodoOnce).set('x-auth', getHeader()['x-auth'])
      .expect(200).expect((res) => {
        setTodo(JSON.parse(res.text));
        expect(getTodo().text).toBe(TodoOnce.text);
      }).end((err) => {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos by using user token', (done) => {
    request(app).get('/todos').set('x-auth', getHeader()['x-auth'])
    .expect(200).expect((res) => {
      setTodo(JSON.parse(res.text).todos[0]);
      expect(getTodo().text).toBe(TodoOnce.text);
    }).end((err) => {
      if (err) {  return done(err); }
      done();
    });
  });

  it('should get a todo by using user token and todo id', (done) => {
    request(app).get('/todos/' + getTodo().id).set('x-auth', getHeader()['x-auth'])
    .expect(200).expect((res) => {
      var todo = JSON.parse(res.text).todo;
      setTodo(JSON.parse(res.text).todo);
      expect(getTodo().text).toBe(TodoOnce.text);
      expect(getTodo().id).toBe(todo.id);
    }).end((err) => {
      if (err) { return done(err); }
      done();
    });
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo as completed', (done) => {
    request(app).patch('/todos/' + getTodo().id).send({
      "text": "Feed the birds.",
      "completed":true
    }).set('x-auth', getHeader()['x-auth'])
    .expect(200).expect((res) => {
      var todo = JSON.parse(res.text).todo;
      expect(todo[0]).toBe(1);
    }).end((err) => {
      if (err) { return done(err); }
      request(app).get('/todos/' + getTodo().id).set('x-auth', getHeader()['x-auth'])
      .expect(200).expect((res) => {
        var todo = JSON.parse(res.text).todo;
        setTodo(JSON.parse(res.text).todo);
        expect(getTodo().text).toBe("Feed the birds.");
        expect(getTodo().id).toBe(todo.id);
        expect(getTodo().completed).toBe(true);
      }).end((err) => {
        if (err) { return done(err); }
        done();
      });
    });
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo by todo id', (done) => {
    request(app).delete('/todos/' + getTodo().id).set('x-auth', getHeader()['x-auth'])
    .expect(200).expect((res) => {
      var status = JSON.parse(res.text).todo;
      expect(status).toBe(1);
    }).end((err) => {
      if (err) { return done(err); }
      request(app).get('/todos').set('x-auth', getHeader()['x-auth'])
      .expect(200).expect((res) => {
        var count = JSON.parse(res.text).todos.length;
        expect(count).toBe(0);
      }).end((err) => {
        if (err) {  return done(err); }
        done();
      });
    });
  });
});

after(teardown);
