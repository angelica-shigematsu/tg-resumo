const Sequelize = require("sequelize")
const connection = require("./config")

const Book = connection.define('book', {
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
  publishingCompany: {
    type: Sequelize.STRING,
    allowNull: false
  },
  genre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

Book.sync({force: false}).then(() => {})

module.exports = Book