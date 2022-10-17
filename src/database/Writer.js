const Sequelize = require("sequelize")
const connection = require("./config")

const Writer = connection.define('writer', {
  idWriter: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nameWriter: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dateBirthWriter: {
    type: Sequelize.DATE,
    allowNull: false
  }
})

Writer.sync({force: false}).then(() => {})

module.exports = Writer