const User = require('../model/User')

async function createVolunteer(req, res) {
  const { fullName , userName, cpf, dateBirthUser, email, password, level, reason } = req.body;
  const active = 'inativo';

  try{
    await User.create({
        fullName,
        userName,
        cpf,
        dateBirthUser,
        email,
        password,
        active,
        level, 
        reason
      }).then(() => 
        res.render('user', { message: 'Enviado com sucesso' })
      );
    }catch(err){
      res.json(err)
    }
};

async function listVolunteer(req, res) {
  await User.findAll({raw: true, order: [
    ['fullName', 'ASC']
  ]}).then(users => {
    res.render("listAllUser", {
      users: users
    });
  });
};

async function updateVolunteer(req, res) {
  const { id } = req.params
  const { fullName, cpf, dateBirthUser, email, password, level, active, reason } = req.body

  try{
    await User.update({
      fullName,
      cpf,
      dateBirthUser,
      email,
      password,
      active,
      level,
      active, 
      reason
    },{
      where: {
        id: id
    }}).then(() => {
      res.redirect('/usuario')
    })
  }catch(error) {
    res.json({error})
  }
}

async function deleteUser(req, res) {
  const { id } = req.body;

  await User.destroy({
     where: { id: id}
  }).then(() => res.redirect(('/login')));

};

module.exports = { createVolunteer, listVolunteer, updateVolunteer, deleteUser }