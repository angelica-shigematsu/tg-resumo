const User = require('../model/User')

async function createVolunteer(req, res) {
  const { fullName } = req.body;
  const { userName } = req.body;
  const { cpf } = req.body;
  const { dateBirthUser } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { level } = req.body;
  const { active } = req.body;

  await User.create({
      fullName,
      userName,
      cpf,
      dateBirthUser,
      email,
      password,
      active,
      level
    }).then(() => res.redirect(('/usuario/listaUsuarios')));

};

async function listVolunteer(req, res) {
  await User.findAll({raw: true, order: [
    ['fullName', 'ASC']
  ]}).then(users => {
    res.render("listUsers", {
      users: users
    });
  });
};

async function updateVolunteer(req, res) {
  const { fullName } = req.body;
  const { userName } = req.body;
  const { cpf } = req.body;
  const { dateBirthUser } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  
}

module.exports = { createVolunteer, listVolunteer }