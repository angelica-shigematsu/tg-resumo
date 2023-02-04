const Sequelize = require('sequelize');
const connection = require('./config')

const Report = connection.define('reports', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  refSummary: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'summaryBooks',
      key: 'id'
    }
  },
  refUser: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
})

Report.sync({force: false}).then(() => {})

module.exports = Report