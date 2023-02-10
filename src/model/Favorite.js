const Sequelize = require("sequelize")
const connection = require("./config")

const Favorite = connection.define('favorites', {
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

Favorite.sync({force: false}).then(() => {})

module.exports = Favorite