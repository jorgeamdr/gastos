import * as sequelize from 'sequelize';

export default function Movimiento(seq: sequelize.Sequelize) {
  const Movimiento = seq.define('Movimientos', {
    importe: sequelize.DECIMAL,
    fecha: sequelize.DATE,
    descripcion: sequelize.STRING,
    notas: sequelize.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Movimiento;
}