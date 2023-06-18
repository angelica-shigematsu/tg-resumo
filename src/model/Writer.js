const Sequelize = require("sequelize")
const connection = require("./config")
const Summary = require("./Summary")

const Writer = connection.define('writers', {
  idWriter: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nameWriter: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

Writer.hasMany(Summary, {
  foreignKey: 'refWriter'
})

Writer.sync({force: false}).then(() => {})

module.exports = Writer