const Sequelize = require('sequelize')
const connection = require('./config')

const Suggestion = connection.define('suggestions', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  observation: {
    type: Sequelize.STRING,
    allowNull: false
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

Suggestion.sync({force: false}).then(()=> {})

module.exports = Suggestion