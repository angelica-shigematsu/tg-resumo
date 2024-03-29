const Sequelize = require('sequelize')
const connection = require("./config")
const Summary = require('./Summary')

const User = connection.define('users', {
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
    type: Sequelize.STRING,
    allowNull: true
  },
  level: {
    type: Sequelize.STRING,
    allowNull: true
  },
  reason: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, {
  tableName: 'users'
})
User.sync({force: false}).then(() => {})

module.exports = User