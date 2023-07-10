const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DBNAME, process.env.DB_USER, process.env.DBPASS, {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;