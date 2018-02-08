import * as express from 'express';
import * as sequelize from 'sequelize';
import * as models from '../../db/models';
import * as dbDriver from '../db-driver';
import * as dbconf from '../../dbconfig';

export class GastosController {
    private readonly db: sequelize.Sequelize = dbDriver.getDriver();
    private routes =  express.Router();

    static getRouter() {
        return new GastosController().routes;
    }

    constructor () {
        let x = express();

        this.routes.get('/', async (req, res, next) => {
            try {
                res.send(await this.Get({...req.params}));
            } catch (err) {
                next(err);
            }
        });
    }

    // @get()
    public Get (id: number) {
        const Movimiento = models.getModels(this.db).Movimiento;
        return Movimiento.findAll();
    }
}

/*
function get() {
    return function (target, propertyKey:string, descriptor: PropertyDescriptor) {

    };
}
*/