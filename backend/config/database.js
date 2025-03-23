const { Sequelize } = require('sequelize');

// PostgreSQL Database Configuration
module.exports = new Sequelize('userdb', 'postgres', 'Nouman2k4', {
  host: 'localhost',
  dialect: 'postgres', // Changed to PostgreSQL
  port: 5432, // PostgreSQL default port
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false // Disable logging for cleaner output
});
