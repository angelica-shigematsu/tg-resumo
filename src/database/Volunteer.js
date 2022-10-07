const Sequelize = require('sequelize')
const connection = require("./config")

const Volunteer = connection.define('volunteer', {
  idVolunteer: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cpf: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dateBirthUser: {
    type: Sequelize.DATE,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
Volunteer.sync({force: false}).then(() => {})

module.exports = Volunteer