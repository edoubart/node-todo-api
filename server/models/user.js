'use strict';

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    tokens: DataTypes.JSON,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
