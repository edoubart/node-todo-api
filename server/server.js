require('./config/config.js');

const bodyParser = require('body-parser');
const express = require('express');
var Sequelize = require('sequelize');

//const { ObjectID } = require('mongodb');

//var { Todo } = require('./models/todo');
//var { User } = require('./models/user');
//var { authenticate } = require('./middleware/authenticate');
var { sequelize } = require('./db/sequelize');

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

const User = require('./models').User;

// POST /users
app.post('/users', (req, res) => {


  User.create({
    firstName: "john",
    lastName: "osullivan",
    email: "johnosullivan@imca.com"
  }).then(function() {
    res.json({});
  });
  /*
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
  */

});

/*
// GET /users/me (Private route)
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.res.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  var body = {
    email: req.body.email,
    password: req.body.password
  };

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {
  req.res.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }), () => {
    res.status(400).send();
  }
});
*/

app.listen(3000, () => {
  console.log(`Listening on ${3000}.`);
});

function isBoolean(value) {
  return value === true || value === false;
}


module.exports = { app };
