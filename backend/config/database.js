const { Sequelize } = require('sequelize');

// Local MySQL (MariaDB) config
module.exports = new Sequelize('userdb', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});