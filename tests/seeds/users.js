const { sequelize, User, Todo } = require('./../../server/models');

const UserOne = {
  email: "johndoe@imbrex.io",
  password: "Zadhaw12@jdaII*1@js!",
  firstName:"John",
  lastName:"Doe"
}

var UserOneResponse = {};
var UserOneHeaders = {};

const setUser = (data) => { UserOneResponse = data; }
const getUser = () => { return UserOneResponse; }

const setHeader = (data) => { UserOneHeaders = data; }
const getHeader = () => { return UserOneHeaders; }

const beforeTest = (done) => {
  done();
};

const teardown = (done) => {
  User.destroy({
    where: {},
    truncate: true
  }).then(function (result) {
    Todo.destroy({
      where: {},
      truncate: true
    }).then(function (result) {
      sequelize.close();
      done();
    }).catch(function (error) {
      sequelize.close();
      done();
    });
  }).catch(function (error) {
    sequelize.close();
    done();
  });
};

module.exports = {
  beforeTest,
  teardown,
  UserOne,
  UserOneResponse,
  setUser,
  getUser,
  setHeader,
  getHeader
};
