const { User } = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (user) {
      res.user = user;
      req.token = token;
      next();
    } else {
      return Promise.reject();
    }
  }).catch((e) => {
    res.status(401).send(e);
  });
};

module.exports = { authenticate };
