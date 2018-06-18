'use strict';
module.exports = (sequelize, DataTypes) => {
  var Todo = sequelize.define('Todo', {
    text: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
    completedAt: DataTypes.INTEGER,
    creator: DataTypes.STRING
  }, {});
  Todo.associate = function(models) {
    // associations can be defined here
  };
  return Todo;
};
