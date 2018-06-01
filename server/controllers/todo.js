const models = require('../models');

class TodoController {

  static getTodos(req, res) {
    try {
      models.Todo.findAll({
        where: { creator: req.user.id }
      }).then(function(todos) {
        res.send({ todos });
      }).catch((e) => {
        res.status(400).send(e);
      });
    } catch (err) {
      res.status(400).send(e);
    }
  }

  static postTodo(req, res) {
    try {
      models.Todo.create({
        text: req.body.text,
        creator: req.user.id
      }).then(function(todo) {
        res.send(todo);
      }).catch((e) => {
        res.status(400).send(e);
      });
    } catch (err) {
      res.status(400).send(e);
    }
  }

  static getTodoByID(req, res) {
    try {
      var id_todo = req.params.id;
      models.Todo.find({
        where: { id: id_todo }
      }).then(function(todo) {
        res.send({ todo });
      }).catch((e) => {
        res.status(400).send(e);
      });
    } catch (err) {
      res.status(400).send(e);
    }
  }

  static deleteTodoByID(req, res) {
    try {
      var id_todo = req.params.id;
      models.Todo.destroy({
        where: { id: id_todo }
      }).then(function(todo) {
        res.send({ todo });
      }).catch((e) => {
        res.status(400).send(e);
      });
    } catch (err) {
      res.status(400).send(e);
    }
  }

  static patchTodoByID(req, res) {
    try {
      var id_todo = req.params.id;
      models.Todo.update({
        text: req.body.text,
        completed: req.body.completed
      },{
        where: { id: id_todo, creator: req.user.id  }
      }).then(function (todo) {
        res.send({ todo });
      }).catch((e) => {
        res.status(400).send();
      });
    } catch (err) {
      res.status(400).send(e);
    }
  }


}

module.exports = TodoController;
