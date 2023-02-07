const Sequelize = require('sequelize')
const connection = require('./config')

const Rating = connection.define('ratings', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ratingStar: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  note: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  refSummary: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'summaryBooks',
      key: 'id'
    }
  },
  refUser: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id'
    }
  }
})

Rating.sync({force: false}).then(() => {})
module.exports = Rating