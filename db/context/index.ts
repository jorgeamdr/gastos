import * as path from 'path'
import * as sequelize from 'sequelize';

import * as movimiento from './movimiento';

function importModel(sequelize: sequelize.Sequelize, importPath: string) {
    return sequelize.import(path.resolve(__dirname, importPath));
}




export function getModels(sequelize: sequelize.Sequelize) {
    return {
        Movimiento: movimiento.default(sequelize)
    }
}
