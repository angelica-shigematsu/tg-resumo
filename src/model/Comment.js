const connection = require('./config')
const Sequelize = require('sequelize')

const Comment = connection.define('Comment', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  commentContent: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  refSummary: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'summaryBooks',
      key: 'id'
    }
  }
})

Comment.sync({ force: false }).then(() => {})

module.exports = Comment