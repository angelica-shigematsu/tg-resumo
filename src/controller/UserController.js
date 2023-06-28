const User = require('../model/User')
const bcrypt = require('bcrypt');

async function createVolunteer(req, res, next) {
  const dataCurrently = new Date().getFullYear()
  let active = 'inativo';
  const { fullName , userName, cpf, dateBirthUser, email, password, level, reason, rules, emailRepeat, passwordRepeat } = req.body;

  if (level !== "Voluntario") active = 'ativo'

  let user = {
    fullName , 
    userName, 
    cpf, 
    dateBirthUser, 
    email, 
    password, 
    level, 
    reason, 
    rules, 
    emailRepeat
  }

  if(password !== passwordRepeat) return res.render('user', { user, message: false, messageError: "Senha incorreta" })

  let dateBirthFormat = new Date(dateBirthUser)

  if (dateBirthFormat.getFullYear() > dataCurrently) return res.render('user', { user, message: false, messageError: "Digite data de nascimento válido" })

  let dateBirth = new Date(dateBirthUser) 

  let age = await getAge(dateBirth.getFullYear());

  if (emailRepeat !== email) return res.render('user', { user, message: false, messageError: "O email não estão iguais" })

  if(rules == undefined) return  res.render('user', { user, message: false, messageError: "Precisa aceitar os termos" })

  if(level == "Voluntario" && age < 18) return  res.render('user', { user, message: false, messageError: "Menor de 18 não pode ser voluntário" })

  const existsUser = await User.findOne({
    where: {
      email: email
    }
  })

  if(existsUser) return res.render('user', { user: user, message: false, messageError: "Já tem cadastro com essa conta" })

  const passwordCript = await criptPassword(password)

    await User.create({
        fullName,
        userName,
        cpf,
        dateBirthUser,
        email,
        password: passwordCript,
        active,
        level, 
        reason
      })
    next();
};

async function getAge(yearBirth) {
  let date = new Date().getFullYear();

  return date - yearBirth 
}

async function listVolunteerByStatus(req, res) {
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile)
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)
    const { active } = req.body

    const users = await User.findAll({
      raw: true, 
      where: { active },
      order: [['createdAt', 'DESC']]
    })

    res.render("listAllUser", {
      users: users, 
      menu: menu,
      admin: admin,
      volunteer: volunteer, 
      profile: profile
    });
 
};

async function listVolunteer(req, res) {
  try {
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile)
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    const users = await User.findAll({
      raw: true, 
      order: [['createdAt', 'DESC']]
    })

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

async function criptPassword(password) {
  const passwordCript = await bcrypt.hash(password, 10);
  return passwordCript
}

module.exports = { 
  createVolunteer, 
  listVolunteer, 
  listVolunteerByStatus,
  updateVolunteer 
}