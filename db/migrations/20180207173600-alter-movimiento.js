'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Movimientos', 'descripcion', {
      type: Sequelize.STRING
    }).then(() => queryInterface.addColumn('Movimientos', 'notas', {
      type: Sequelize.STRING
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Movimientos', 'importe')
      .then(()=> queryInterface.removeColumn('Movimientos', 'importe'));
  }
};