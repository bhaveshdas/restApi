const Sequelize = require('sequelize');

const sequelize = new Sequelize('rest_api_implementation', 'root', 'e4d5exd5Qxd5Nc3', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;