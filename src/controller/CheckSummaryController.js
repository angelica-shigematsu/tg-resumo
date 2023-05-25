const Book = require("../model/Book")
const CheckSummarys = require("../model/CheckSummary")
const Summary = require("../model/Summary")
const User = require("../model/User")

async function getInformationSummary(req, res) {
  try{
    const { id } = req.params

    let profile = await getUserInformation(req,res)
    let menu = await getlevelUser(profile)
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    Summary.belongsTo(User, {
      foreignKey: {
        name: 'refUser'
      }
    })
    Summary.belongsTo(Book, {
      foreignKey: {
        name: 'refBook'
      }
    })

    const summary = await Summary.findOne({
      where: {
        id: id
      },
      include: [{
        association: 'book',
        atributes: ['title'],
        key: 'refBook'
      }, {
        association: 'user',
        atributes: ['fullName'],
        key: 'refUser'
      }]
    })

    res.render('checkSummary', { 
      summary: summary,
      message: 'Alterado com sucesso',
      profile,
      menu,
      admin,
      volunteer
    })
  }catch(error) {
    res.status(400).send('Erro ao mostrar informações do resumo!')
  }
}

async function getInformationAllSummary(req, res) {
  try{

    Summary.belongsTo(Book, {
      foreignKey: {
        name: 'refBook'
      }
    })

    Summary.belongsTo(User, {
      foreignKey: {
        name: 'refUser'
      }
    })
    
    const summaries = await Summary.findAll({
      include: [{
        association: 'book',
        atributes: ['title'],
        key: 'refBook'
      },{
        association: 'user',
        attributes: ['id', 'fullName'],
        key: 'refUser'
      }]
    })
    return summaries

  }catch(error) {
    res.status(400).send('Erro ao listar resumos!')
  }
}

async function showInformationAllSummary(req, res) {
  let profile = await getUserInformation(req,res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  let summaries = await getInformationAllSummary(req, res)

  res.render('checkAllSummary', { 
    summaries,
    menu: menu,
    admin: admin, 
    messageError: false,
    volunteer: volunteer,
    profile: profile
  })
}

async function createCheckedSummary(req, res) {
  const { comment, refSummary, status} = req.body

  const { id } = req.params
  const refVolunteer = await getUserInformation(req, res)
  const date = new Date();

  let profile = await getUserInformation(req,res)
  
  Summary.belongsTo(User, {
    foreignKey: {
      name: 'refUser'
    }
  })

  const summary = await Summary.findOne({
      where: {
        id: id
      },
      include: [{
        association: 'user',
        atributes: ['id'],
        key: 'refUser'
      }]
    })

    if(summary.user.id === profile.id) 
      showInformationAllSummary(req, res)

    await CheckSummarys.create({
      status,
      comment,
      date,
      refSummary,
      refVolunteer: refVolunteer.id
    })

    await Summary.update({
      status: status,
      },{
        where: {
          id: refSummary
      }
    })

  res.redirect('/correcao/resumo')
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

async function getlevelVolunteer(profile) {
  if (profile.level == 'Voluntario')
    return true
  else
    return false
}

async function getlevelAdmin(profile) {
  if (profile.level == 'Administrador')
    return true
  else
    return false
}

module.exports = {
  getInformationSummary,
  showInformationAllSummary,
  createCheckedSummary,
}