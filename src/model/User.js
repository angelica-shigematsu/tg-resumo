const Sequelize = require('sequelize')
const connection = require("./config")

const User = connection.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cpf: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dateBirthUser: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  active: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  level: {
    type: Sequelize.STRING,
    allowNull: true
  }
})
User.sync({force: false}).then(() => {})

module.exports = User