'use strict';
module.exports = (sequelize, DataTypes) => {
  var TipoMovimiento = sequelize.define('TipoMovimiento', {
    nombre: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TipoMovimiento;
};