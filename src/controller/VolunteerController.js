const Volunteer = require('../database/Volunteer')
const dataVolunteer = require('../model/Volunteer')
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

async function listVolunteer(req, res) {
  const listVolunteers = dataVolunteer.get()

  res.redirect('/listVolunteer' + { volunteers: listVolunteers })
}
module.exports = { createVolunteer, listVolunteer }