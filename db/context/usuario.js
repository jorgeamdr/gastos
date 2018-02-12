'use strict';
module.exports = (sequelize, DataTypes) => {
  var Usuario = sequelize.define('Usuario', {
    login: DataTypes.STRING,
    salt: DataTypes.STRING,
    password: DataTypes.STRING,
    ultimoLogin: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Usuario;
};