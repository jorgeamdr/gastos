'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Movimientos', 'importe', {
      type: Sequelize.DECIMAL
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Movimientos', 'importe');
  }
};