var mongoose = require('mongoose');
var Sequelize = require('sequelize');

//mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI);

const sequelize = new Sequelize('todo', 'johnosullivan', 'mogilska', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = { sequelize };
