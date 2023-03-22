const Sequelize = require('sequelize');
const connection = require('./config')

const MeasureReport = connection.define('measurereport', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  observation: {
    type: Sequelize.STRING,
    allowNull: false
  },
  data: {
    type: Sequelize.DATE,
    allowNull: false
  },
  refUserViewSummary: {
    type: Sequelize.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  refReport: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'reports',
      key: 'id'
    }
  }
})

MeasureReport.sync({force: false}).then(() => {})

module.exports = MeasureReport