import * as express from 'express';
import * as sequelize from 'sequelize';
import * as moment from 'moment';

import * as dbDriver from '../db-driver';
import * as dbconf from '../../dbconfig';
import * as context from '../../db/context';
import * as models from '../../db/models';
import Movimiento from '../../db/context/movimiento';
import { isNumber } from 'util';

export class ReportesController {
    private readonly db: sequelize.Sequelize = dbDriver.getDriver();
    private routes =  express.Router();

    static getRouter() {
        return new ReportesController().routes;
    }

    constructor () {
        this.routes.get('/gastos-diarios', async (req, res, next) => {
            try {
                res.send(await this.Get(req.query));
            } catch (err) {
                next(err);
            }
        });

    }

    // @get()
    public async Get ({fechaInicio, fechaFin}) {
        const MovimientoContext = context.getModels(this.db).Movimiento;
        fechaFin = moment(fechaFin).add(1, 'month');

        const movimientos = await MovimientoContext.findAll({
          where: {
            fecha: {
              [sequelize.Op.gte]: fechaInicio,
              [sequelize.Op.lt]: fechaFin,
            }
          }
        });

        const dias = [];
        movimientos.forEach(movimiento => {
          const dia = moment(movimiento.fecha).startOf('day').toISOString();
          if (dias.indexOf(dia) === -1) {
            dias.push(dia);
          }
        });
        const movimientosDiarios = dias.map(dia => ({
          fecha: dia,
          importe: movimientos.filter(movimiento =>
            moment(movimiento.fecha).startOf('day').toISOString() === dia
          ).reduce((sum, movimiento) =>
            sum + (+movimiento.importe)
          , 0)
        }));

        return movimientosDiarios;
    }
}

/*
function get() {
    return function (target, propertyKey:string, descriptor: PropertyDescriptor) {

    };
}
*/
