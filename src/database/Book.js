const Sequelize = require("sequelize")
const connection = require("./config")

const Book = connection.define('book', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refWriter: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  publishingCompany: {
    type: Sequelize.STRING,
    allowNull: false
  },
  genre: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  year: {
    type: Sequelize.DATE,
    allowNull: false
  },
  imgBook: {
    type: Sequelize.BLOB('long'),
    allowNull: false
  }
})

Book.sync({force: false}).then(() => {})

module.exports = Book