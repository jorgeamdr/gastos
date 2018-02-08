const config = {
    development: {
      username: 'root',
      password: '',
      database: 'gastos-patos',
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql'
    },
    production: {
      	DATABASE_URL: process.env.DATABASE_URL
    }
};

module.exports = config;
