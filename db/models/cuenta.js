'use strict';
module.exports = (sequelize, DataTypes) => {
  var Cuenta = sequelize.define('Cuenta', {
    nombre: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Cuenta;
};