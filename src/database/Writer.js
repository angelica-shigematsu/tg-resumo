const Sequelize = require("sequelize")
const connection = require("./config")

const Book = connection.define('writer', {
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
  },
  
})

Book.sync({force: false}).then(() => {})

module.exports = Book