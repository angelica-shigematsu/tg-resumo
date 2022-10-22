const Sequelize = require('sequelize')
const connection = new Sequelize('summary', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;