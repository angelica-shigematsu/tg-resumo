const Sequelize = require("sequelize")
const connection = require("./config")
const Summary = require("./Summary")

const Book = connection.define('books', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refWriter: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'writers',
      key: 'idWriter'
    }
  },
  genre: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
Book.hasMany(Summary, {
  foreignKey: 'refBook'
})
Book.sync({force: false}).then(() => {})

module.exports = Book