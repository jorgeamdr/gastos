import * as express from 'express';
import * as sequelize from 'sequelize';

import * as dbDriver from '../db-driver';
import * as dbconf from '../../dbconfig';
import * as context from '../../db/context';
import * as models from '../../db/models';
import Movimiento from '../../db/context/movimiento';
import { isNumber } from 'util';

export class GastosController {
    private readonly db: sequelize.Sequelize = dbDriver.getDriver();
    private routes =  express.Router();

    static getRouter() {
        return new GastosController().routes;
    }

    constructor () {
        this.routes.get('/', async (req, res, next) => {
            try {
                res.send(await this.Get({...req.params}));
            } catch (err) {
                next(err);
            }
        });

        this.routes.post('/', async (req, res, next) => {
            console.log(req.body);
            try {
                res.send(await this.Post(req.body));
            } catch (err) {
                console.log(err);
                next(err);
            }
        });

        this.routes.put('/:id', async (req, res, next) => {
            if (+req.params.id !== req.body.id) {
                res.sendStatus(400);
            }

            try {
                res.send(await this.Put(req.body));
            } catch (err) {
                console.log(err);
                next(err);
            }
        });

        this.routes.delete('/:id', async (req, res, next) => {
            if (isNaN(+req.params.id)) {
                res.sendStatus(400);
                return;
            }

            try {
                await this.Delete(req.params.id);
                res.sendStatus(200);
            } catch (err) {
                console.log(err);
                next(err);
            }
        });
    }

    // @get()
    public async Get (params: any) {
        const MovimientoContext = context.getModels(this.db).Movimiento;
        return await MovimientoContext.findAll({
          order: [['fecha', 'asc']]
        });
    }

    public async Post (movimientos: models.Movimiento|Array<models.Movimiento>) {
        const MovimientoContext = context.getModels(this.db).Movimiento;

        if (!Array.isArray(movimientos)) {
            const movimiento = movimientos;

            return await MovimientoContext.create({
                importe: movimiento.importe,
                fecha: movimiento.fecha,
                descripcion: movimiento.descripcion,
                notas: movimiento.notas
            }).then(mov => ({
                id: mov.id
            }));
        } else {
            return await MovimientoContext.bulkCreate(
                movimientos.map(movimiento => ({
                    importe: movimiento.importe,
                    fecha: movimiento.fecha,
                    descripcion: movimiento.descripcion,
                    notas: movimiento.notas
                }))
            );
        }
    }

    public async Put (movimiento: models.Movimiento) {
        const MovimientoContext = context.getModels(this.db).Movimiento;

        return MovimientoContext.update({
            fecha: movimiento.fecha,
            importe: movimiento.importe,
            descripcion: movimiento.descripcion,
        } as any, {
            where: { id: movimiento.id}
        });
    }

    public async Delete (id: number) {
        const MovimientoContext = context.getModels(this.db).Movimiento;

        return MovimientoContext.destroy({
            where: { id }
        });
    }
}

/*
function get() {
    return function (target, propertyKey:string, descriptor: PropertyDescriptor) {

    };
}
*/
