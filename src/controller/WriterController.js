const Writer = require('../model/Writer')
const User = require('../model/User')

async function getInformationMenu(req, res) {
  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  res.render("registerWriter", { 
    message: false,  
    messageError: false,
    menu: menu,
    admin: admin,
    volunteer: volunteer,
    profile: profile
  })
}

async function createWriter(req, res) {
  const { nameWriter } = req.body

  try{
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    const writers = await showAllWriters()

    await Writer.create({
    nameWriter
  }).then(() => res.render("listAllWriters", {
     writers: writers, 
     message: 'Criado com sucesso', 
     messageError: false,
     menu: menu,
     admin: admin,
     volunteer: volunteer,
     profile: profile
    }))
  }catch(error){
    res.json(error)
  }
}

async function listAllWriter(req, res) {
  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  const writers = await showAllWriters()
    res.render("listAllWriters", {
        writers: writers,
        message: false, 
        messageError: false,
        menu: menu,
        admin: admin,
        volunteer: volunteer,
        profile: profile
  })
} 

async function showAllWriters() {
  const writers = await Writer.findAll({ raw : true, order: [
    ['nameWriter', 'ASC']//ordem decrescente
  ]})
  return writers

}

async function listWriter(req, res) {
  const { id } = req.params

  const numberId = Number(id)

  if(isNaN(numberId)) return res.redirect("/autor/listEscritor")

  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  await Writer.findByPk(numberId).then(writers => {
    if(!writers) return res.redirect("listEscritor")

    res.render("listWriter", { 
      writers: writers,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      profile: profile 
    })
  })
} 

async function updateWriter(req, res) {
  const { id } = req.params
  const { nameWriter } = req.body
  const { dateBirthWriter } = req.body

  if(!nameWriter && !dateBirthWriter )  res.render("listAllWriters")

  try{
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    const writers = await showAllWriters()

    await Writer.update({
      nameWriter,
      dateBirthWriter
    },{
      where: {
        idWriter: id
    }}).then(() => {
      res.render('listAllWriters', {  
        writers: writers, 
        message: 'Alterado com sucesso', 
        messageError: false,
        menu: menu,
        admin: admin,
        volunteer: volunteer,
        profile: profile 
      })
    })
  }catch(err) {
    res.status(400).send('Erro em atualizar os dados do Escritor')
  }
}

async function deleteWriter( req, res) {
  const { id } = req.body

  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  try{
    const writers = await showAllWriters()
    await Writer.destroy({
      where: { idWriter: id }
    }).then(() => {
      return res.render("listAllWriters", { 
        writers: writers, 
        message: 'Excluído com sucesso', 
        messageError: false,
        menu: menu,
        admin: admin,
        volunteer: volunteer,
        profile: profile 
        } )
    })
  }catch(err) {
    res.status(400).send('Não pode excluir dados do escritor! Tem dependência de livro cadastrado!')
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
  getInformationMenu,
  createWriter, 
  listAllWriter, 
  listWriter, 
  showAllWriters,
  updateWriter, 
  deleteWriter  
}