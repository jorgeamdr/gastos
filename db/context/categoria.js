'use strict';
module.exports = (sequelize, DataTypes) => {
  var Categoria = sequelize.define('Categoria', {
    nombre: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Categoria;
};