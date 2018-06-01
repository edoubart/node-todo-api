require('./config/config.js');

const bodyParser = require('body-parser');
const express = require('express');
var Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
//const { ObjectID } = require('mongodb');

//var { Todo } = require('./models/todo');
//var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');
var { sequelize } = require('./db/sequelize');

const models = require('./models');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// POST /todos
/*
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.res.user._id
  });

  todo.save().then((todo) => {
    res.send(todo);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// GET /todos
app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.res.user._id
  }).then((todos) => {
    res.send({ todos });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// GET /todos/:id
app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (ObjectID.isValid(id)) {
    Todo.findOne({
      _id: id,
      _creator: req.res.user._id
    }).then((todo) => {
      if (todo) {
        res.send({ todo });
      } else {
        res.status(404).send();
      }
    }).catch((e) => {
      res.status(400).send();
    });
  } else {
    res.status(404).send();
  }
});

// DELETE /todos/:id
app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (ObjectID.isValid(id)) {
    Todo.findOneAndRemove({
      _id: id,
      _creator: req.res.user._id
    }).then((todo) => {
      if (todo) {
        res.send({ todo });
      } else {
        res.status(404).send();
      }
    }).catch((e) => {
      res.status(400).send();
    });
  } else {
    res.status(404).send();
  }
});

// PATCH /todos/:id
app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = {
    text: req.body.text,
    completed: req.body.completed
  };

  if (ObjectID.isValid(id)) {
    if (isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo.findOneAndUpdate({
      _id: id,
      _creator: req.res.user._id
    }, {$set: body}, {new: true}).then((todo) => {
      if (todo) {
        res.send({ todo });
      } else {
        res.status(404).send();
      }
    }).catch((e) => {
      res.status(400).send();
    });

  } else {
    res.status(404).send();
  }
});*/


// POST /users
app.post('/users', (req, res) => {

  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {

        // Create a new user
        models.User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          tokens: []
        }).then(function(data) {

          var user = data.dataValues;
          var access = 'auth';

          var token = jwt.sign({access, id: user.id}, "process.env.JWT_SECRET");
          user.tokens = user.tokens.concat([{access, token}]);

          models.User.update({
            tokens: user.tokens
          },{
            where: { id: user.id }
          }).then(function (result) {
            res.header('x-auth', token);
            res.json(user);
          });

        });


    });
  });


});

// GET /users/me (Private route)
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  var creds = {
    email: req.body.email,
    password: req.body.password
  };

  models.User.find({
    where: { email: creds.email }
  }).then(function(user) {
    var user_profile = user.dataValues;

    bcrypt.compare(creds.password, user_profile.password, (err, resp) => {
        if (res) {

          var access = 'auth';

          var token = jwt.sign({access, id: user.id}, "process.env.JWT_SECRET");
          user.tokens = user.tokens.concat([{access, token}]);

          models.User.update({
            tokens: user.tokens
          },{
            where: { id: user.id }
          }).then(function (result) {
            res.header('x-auth', token);
            res.json(user);
          });

        }
    });

  });

});


// DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {

  var tokens = req.user.tokens;

  for (var i = 0; i < tokens.length; i++) {
    var current_token = tokens[i];
    if (current_token.token == req.token) {
      tokens.splice(i,1);
    }
  }

  models.User.update({
    tokens: tokens
  },{
    where: { id: req.user.id }
  }).then(function (result) {
    res.status(200).send();
  });

});


app.listen(3000, () => {
  console.log(`Listening on ${3000}.`);
});

function isBoolean(value) {
  return value === true || value === false;
}


module.exports = { app };
