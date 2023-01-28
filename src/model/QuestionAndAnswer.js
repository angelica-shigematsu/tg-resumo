const Sequelize = require('sequelize')
const connection = require('./config')

const QuestionAndAnswer = connection.define('questions', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  question: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  answer: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  refBook: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    }
  },
  refVolunteer: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
})

QuestionAndAnswer.sync({force: false}).then(() => {})

module.exports = QuestionAndAnswer