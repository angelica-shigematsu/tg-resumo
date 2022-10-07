const Volunteer = require('../database/Volunteer')

async function createVolunteer(req, res) {
  const { fullName } = req.body
  const { userName } = req.body
  const { cpf } = req.body
  const { dateBirthUser } = req.body
  const { email } = req.body
  const { password } = req.body

  await Volunteer.create({
    fullName,
    userName,
    cpf,
    dateBirthUser,
    email,
    password
  }).then(() => res.redirect(('/')))
}

module.exports = { createVolunteer }