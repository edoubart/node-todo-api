const models = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { sequelize, User } = require("../models");

class UserController {

  static async test_db_transaction(req, res) {
    let t;
    try {
      t = await sequelize.transaction({
        isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
      });

      const user = await User.create({
        firstName: "blank",
        lastName: "blank",
        email: req.body.email,
        password: "test",
        tokens: []
      }, { transaction: t });

      const results = await user.update({
        firstName: 'John',
        lastName: 'Boothe'
      }, { transaction: t });

      await t.commit();
      res.json({ "transaction":true, "error":undefined });
    } catch (err) {
      await t.rollback();
      res.json({ "transaction":false, "error":err });
    }
  }

  static postUser(req, res) {
    try {
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

            }).catch(function (error) {
              res.status(400).send(err);
            });

        });
      });
    } catch (err) {
      res.status(400).send(e);
    }
  }

  static getUser(req, res) {
    try {
      res.send(req.user);
    } catch (err) {
      res.status(400).send(e);
    }
  }

  static userLogin(req, res) {
    try {
      var creds = {
        email: req.body.email,
        password: req.body.password
      };
      models.User.find({
        where: { email: creds.email }
      }).then(function(user) {
        var user_profile = user.dataValues;
        bcrypt.compare(creds.password, user_profile.password, (err, resp) => {
            if (resp) {

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

            } else {
              res.status(400).send(err);
            }
        });

      });
    } catch (err) {
      res.status(400).send(err);
    }
  }

  static deleteToken(req, res) {
    try {
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
    } catch (err) {
      res.status(400).send(e);
    }
  }

}

module.exports = UserController;
