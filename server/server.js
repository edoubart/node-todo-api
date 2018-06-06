require('./config/config.js');

const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

var { authenticate } = require('./middleware/authenticate');
const models = require('./models');
const TodoController = require("./controllers/todo");
const UserController = require("./controllers/user");

var app = express();
const port = 3000;

// Sets the body parser
app.use(bodyParser.json());
// POST /todos
app.post('/todos', authenticate, TodoController.postTodo);
// GET /todos
app.get('/todos', authenticate, TodoController.getTodos);
// GET /todos/:id
app.get('/todos/:id', authenticate, TodoController.getTodoByID);
// DELETE /todos/:id
app.delete('/todos/:id', authenticate, TodoController.deleteTodoByID);
// PATCH /todos/:id
app.patch('/todos/:id', authenticate, TodoController.patchTodoByID);
// POST /users
app.post('/users', UserController.postUser);
// GET /users/me (Private route)
app.get('/users/me', authenticate, UserController.getUser);
// POST /users/login {email, password}
app.post('/users/login', UserController.userLogin);
// DELETE /users/me/token
app.delete('/users/me/token', authenticate, UserController.deleteToken);

app.post('/test_db_transaction', UserController.test_db_transaction);

var server = app.listen(port, () => {
  console.log(`Listening on ${port}.`);
});

function shutdown(done) {
  server.close(done);
}

module.exports = { app, shutdown };
