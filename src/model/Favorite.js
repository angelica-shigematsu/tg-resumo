const Sequelize = require("sequelize")
const connection = require("./config")

const Favorite = connection.define('favorites', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  created_at: {
    type: Sequelize.DATEONLY,
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

Favorite.sync({alter: true}).then(() => {})

module.exports = Favorite