const Sequelize = require('sequelize')
const connection = require('./config')

const Summary = connection.define('summary', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  refWriter: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'writer',
      key: 'writerId'
    }
  },
  refVolunteer: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
})

Summary.sync({force: false}).then(() => {})

module.exports = Summary

