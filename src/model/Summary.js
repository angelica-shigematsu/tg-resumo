const Sequelize = require('sequelize')
const connection = require('./config')

const Summary = connection.define('summaryBook', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  refWriter: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'writers',
      key: 'idWriter'
    }
  },
  refVolunteer: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  refBook: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    }
  }
})

Summary.sync({force: false}).then(() => {})

module.exports = Summary

