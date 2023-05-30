const User = require('../model/User')

async function createVolunteer(req, res) {
  const { fullName , userName, cpf, dateBirthUser, email, password, level, reason, rules, emailRepeat } = req.body;
  const active = 'ativo';

  let dateBirth = new Date(dateBirthUser)

  let age = await getAge(dateBirth.getFullYear());

  if (emailRepeat != email) res.render('user', { message: false, messageError: "O email não estão iguais" })

  if(rules == undefined) return  res.render('user', { message: false, messageError: "Precisa aceitar os termos" })

  if(level == "Voluntario" && age < 18) return  res.render('user', { message: false, messageError: "Menor de 18 não pode ser voluntário" })

  const existsUser = await User.findOne({
    where: {
      email: email
    }
  })

  if(existsUser) return res.render('user', { message: false, messageError: "Já tem cadastro com essa conta" })

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
        res.render('user', { message: 'Enviado com sucesso', messageError: false })
      );
    }catch(err){
      res.json(err)
    }
};

async function getAge(yearBirth) {
  let date = new Date().getFullYear();

  return yearBirth - date
}

async function listVolunteer(req, res) {
  try {
  const users = await User.findAll({raw: true, order: [
    ['fullName', 'ASC']
    ]
  });
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile)
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    res.render("listAllUser", {
      users: users, 
      menu: menu,
      admin: admin,
      volunteer: volunteer, 
      profile: profile
    });
  }catch(error) {
    res.json('error')
  }
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
    res.render('user', { messageError: 'Erro: Não criado'})
  }
}

async function getUserInformation(req, res) {
  if (req.isAuthenticated()) {
      const  { email } = req.user
      const profile = await User.findOne({
        where: { email: email}
    })
    return profile
  }
}

async function getlevelUser(profile) {
  if (profile.level == 'Usuario')
    return false
  else
    return true
}

async function getlevelAdmin(profile) {
  if (profile.level == 'Administrador')
    return true
  else
    return false
}

async function getlevelVolunteer(profile) {
  if (profile.level == 'Voluntario')
    return true
  else
    return false
}

module.exports = { 
  createVolunteer, 
  listVolunteer, 
  updateVolunteer 
}