'use strict';
module.exports = (sequelize, DataTypes) => {
  var Persona = sequelize.define('Persona', {
    nombre: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Persona;
};