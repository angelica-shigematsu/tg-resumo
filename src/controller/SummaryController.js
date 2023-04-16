const Book = require('../model/Book')
const Rating = require('../model/Rating')
const Report = require('../model/Report')
const Summary = require('../model/Summary')
const Volunteer = require('../model/User')
const Writer = require('../model/Writer')

async function searchTitleBook(req, res) {
  const { title } = req.body
  try{
    let book = await Book.findOne({ attributes: ['refWriter', 'title', 'id'], where: { title: title }})
    let idWriter = book.refWriter
    let writer = await Writer.findOne({ where: { idWriter : idWriter }})

    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    res.render("summarySubmit", { 
      book: { 
        id: book.id, 
        title: book.title, 
        refWriter: book.refWriter,
      }, 
      writer: {
        nameWriter: writer.nameWriter
      },
      profile: profile,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      messageErro: false,
    })
  }catch(error){
    res.render('summary', {messageError: `Não existe este livro ${title}`, menu: menu})
  }
}

async function createSummary(req, res) {
  const { body, refWriter, refVolunteer, refBook} = req.body
  let status = 'Não avalidado'
  try{
    await Summary.create({
    body,
    status,
    refWriter,
    refVolunteer,
    refBook
  }).then(() => showAllSummary(req, res))
  }catch(error){
    res.status(400).send('Erro ao criar resumo!')
  } 
}

async function showAllSummary(req, res) {
  const summaries = await listAllSummary();

  let profile = await getUserInformation(req, res);
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  const ratings = await Rating.findAll({
    raw: true
  })

  res.render('listAllSummary', {  
    summaries: summaries, 
    ratings: ratings, 
    messageError: false, 
    messageReport: false,
    menu: menu,
    admin: admin,
    volunteer: volunteer,
    profile: profile
  })
}

async function listSummary(req, res) {
  try{
  const { id } = req.params
  let { active, reportId } = req.body

  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  await Report.update({
    active
  }, {
    where: { id : reportId }
  })

    Summary.belongsTo(Volunteer, {
    foreignKey: {
      name: 'id'
    }})

    Summary.belongsTo(Writer, {
      foreignKey: {
        name: 'id'
      }})

    Summary.belongsTo(Book, {
      foreignKey: {
        name: 'id'
      }});  

    const summary = await Summary.findOne({
      where: { id: id },
      include: [{
        association: 'user',
        attributes: ['fullName'],
      },{
        association: 'writer',
        attributes: ['nameWriter'],
      },{
        association: 'book',
        attributes: ['title'],
    }]
  })
     res.render('listSummary', { 
      summary: summary,
      book: summary.book.title , 
      volunteer: summary.user.fullName, 
      writer: summary.writer.nameWriter,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      profile: profile,
      message: 'Alterado com sucesso',
      refUserComment: refUserComment
    })
  }catch(err){
    res.json(err)
  } 
}

async function listAllSummary() {
  try{
    Summary.belongsTo(Volunteer, {
      foreignKey: {
        name: 'id'
      }})

    Summary.belongsTo(Writer, {
        foreignKey: {
          name: 'id'
        }})

    Summary.belongsTo(Book, {
        foreignKey: {
          name: 'id'
        }});  
    
      const summary = await Summary.findAll({
        attributes: ['body', 'id', 'refBook', 'refVolunteer', 'status'],
        include: [{
        association: 'writer',
        attributes: ['nameWriter'],
      },{
        association: 'book',
        attributes: ['title'],
      },{
        association: 'user',
        attributes: ['id']
      }
    ]   
    })

    return summary
  }catch(error){
    throw new Error(error)
  }
}

async function updateSummary(req, res) {
  const { id } = req.params
  const { body, refWriter, refVolunteer, refBook } = req.body

  try{
    await Summary.update({
      body,
      status,
      refWriter,
      refVolunteer,
      refBook
    },{
      where: {
        id: id
      }
    }).then((summary) => {
      listSummary(req,res) })

  }catch(err) {
    res.json(err)
  }
}

async function deleteSummary(req, res) {
  const { id } = req.body

  try{
    await Summary.destroy({
      where: { id: id }
    }).then(() => {
      res.redirect('/resumo/listaResumo')
    })
  }catch(err) {
    res.redirect('/resumo/listaResumo')
  }
}

async function getUserInformation(req, res) {
  if (req.isAuthenticated()) {
      const  { email } = req.user
      const profile = await Volunteer.findOne({
        where: { email: email}
    })
    return profile
  }
}

async function getlevelUser(profile) {
  if (profile.level == 'Usuario')
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

async function getlevelVolunteer(profile) {
  if (profile.level == 'Voluntario')
    return true
  else
    return false
}

async function showSummary(req, res) {
  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelUser(profile)
  let volunteer = await getlevelVolunteer(profile)

  res.render("summary", { 
    messageError: false, 
    menu: menu, 
    admin: admin, 
    volunteer: volunteer
  })
}


module.exports = { 
    searchTitleBook, 
    createSummary, 
    listAllSummary, 
    listSummary, 
    showAllSummary,
    showSummary,
    updateSummary,
    deleteSummary
  }