import * as Sequelize from 'sequelize';
import * as config from '../dbconfig';

const envConfig = config[process.env.NODE_ENV || 'development'];

export function getDriver() {
    let sequelize: Sequelize.Sequelize;

    if (envConfig.DATABASE_URL) {
        sequelize = new Sequelize(envConfig.DATABASE_URL, { });
    } else {
        sequelize = new Sequelize(envConfig.database, envConfig.username, envConfig.password, {
            host: envConfig.host,
            port: envConfig.port,
            dialect: envConfig.dialect,
        });
    }

    return sequelize;
}

