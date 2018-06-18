const { sequelize, User, Todo } = require('./../../server/models');

const UserTodo = {
  email: "johndoetodo@imbrex.io",
  password: "Zadhaw12@sdaf*1@js!",
  firstName:"John",
  lastName:"Doe"
}

const TodoOnce = {
  text: "feed the mouse!"
}

var UserTodoResponse = {};
var UserTodoHeaders = {};
var TodoItem = {};

const setUser = (data) => { UserTodoResponse = data; }
const getUser = () => { return UserTodoResponse; }

const setHeader = (data) => { UserTodoHeaders = data; }
const getHeader = () => { return UserTodoHeaders; }

const setTodo = (data) => { TodoItem = data; }
const getTodo = () => { return TodoItem; }

const beforeTest = (done) => {
  done();
};

const teardown = (done) => {
  done();
};

module.exports = {
  beforeTest,
  teardown,
  UserTodo,
  setUser,
  getUser,
  setHeader,
  getHeader,
  TodoOnce,
  setTodo,
  getTodo
};
