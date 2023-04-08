const Sequelize = require('sequelize');
const connection = require('./config')

const CheckSummarys = connection.define('checkSummarys', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  comment: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATEONLY,
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
  refVolunteer: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id'
    }
  }
})

CheckSummarys.sync({alter: true}).then(() => {})

module.exports = CheckSummarys;