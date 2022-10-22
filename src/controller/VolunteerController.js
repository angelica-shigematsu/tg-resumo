const Volunteer = require('../model/Volunteer')

async function createVolunteer(req, res) {
  const { fullName } = req.body
  const { userName } = req.body
  const { cpf } = req.body
  const { dateBirthUser } = req.body
  const { email } = req.body
  const { password } = req.body

  try{
    await Volunteer.create({
      fullName,
      userName,
      cpf,
      dateBirthUser,
      email,
      password
    }).then(() => res.redirect(('/listVolunteer')));

  }catch(error) {
    throw new Error(error)
  }
}

async function listVolunteer(req, res) {
  await Volunteer.findAll({raw: true, order: [
    ['fullName', 'ASC']
  ]}).then(volunteers => {
    res.render("listVolunteer", {
      volunteers: volunteers
    });
  });
}
module.exports = { createVolunteer, listVolunteer }