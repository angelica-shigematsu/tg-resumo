const Sequelize = require('sequelize');
const Op = Sequelize.Op
const Book = require('../model/Book')
const CheckSummary = require('../model/CheckSummary')
const Rating = require('../model/Rating')
const Report = require('../model/Report')
const Suggestion = require('../model/Suggestion')
const Summary = require('../model/Summary')
const User = require('../model/User')
const Writer = require('../model/Writer')

async function showAllBookToRegiterSummary(req, res) {
  const { fieldSearch } = req.body

  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

    Book.belongsTo(Writer, {
      foreignKey: 'refWriter'
    })

    const books = await Book.findAll({
      where: { 
        title: { [Op.like]: `%${fieldSearch}%` }
      },
      attributes: ['id', 'title', 'refWriter']
    })

    res.render("chooseBook", { 
      books: books,
      profile: profile,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      messageErro: false,
    })
  
}

async function searchTitleBook(req, res) {
  const { id } = req.body

  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

    const book = await Book.findOne({
      where: { id },
      attributes: ['id', 'title', 'refWriter'],
    })

    let idWriter = book.refWriter
    let writer = await Writer.findOne({ where: { idWriter : idWriter }})

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
  
}

async function createSummary(req, res) {
  const { body, refWriter, refBook} = req.body
  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  let refUser = profile.id;
  let status = 'Não avaliado'
    await Summary.create({
    body,
    status,
    refWriter,
    refUser,
    refBook
    })

    const summaries = await listAllSummary();
    
    const ratings = await Rating.findAll({
      raw: true
    })

    res.render('listSummariesForEachUser', {  
      summaries: summaries, 
      ratings: ratings,
      message: false, 
      messageError: false, 
      messageReport: false,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      profile: profile
    })
 
}

async function showAllSummary(req, res) {

  let profile = await getUserInformation(req, res);
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  Summary.belongsTo(User, {
    foreignKey: {
      name: 'refUser'
    }
})

  Summary.belongsTo(Writer, {
      foreignKey: {
        name: 'refWriter'
      }
  })

  Summary.belongsTo(Book, {
      foreignKey: {
        name: 'refBook'
      }
  });  
  
  const summaries = await Summary.findAll({
    order: [['createdAt', 'DESC']],
    include: [{
      association: 'writer',
      attributes: ['nameWriter'],
      key: 'refWriter'
    },{
      association: 'book',
      attributes: ['title'],
      key: 'refBook'
    },
    {
      association: 'user',
      attributes: ['id', 'fullName'],
      key: 'refUser'
    }],
    nested: true, 
  })

  const ratings = await Rating.findAll({
    raw: true
  })

  res.render('listAllSummary', {  
    summaries: summaries, 
    ratings: ratings,
    message: false, 
    messageError: false, 
    messageReport: false,
    menu: menu,
    admin: admin,
    volunteer: volunteer,
    profile: profile
  })
}

async function showAllSummaryVolunteerToUp(req, res) {
  const summaries = await listAllSummary();

  let profile = await getUserInformation(req, res);
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  const ratings = await Rating.findAll({
    raw: true
  })

  res.render('listAllSummaryToUser', {  
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
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

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

    Summary.belongsTo(Writer, {
      foreignKey: 'refWriter'
    })

    const summary = await Summary.findOne({
      where: { id: id },
      include: [{
        association: 'user',
        attributes: ['fullName', 'id'],
        key: 'refUser'
      },{
        association: 'writer',
        attributes: ['nameWriter'],
        key: 'refWriter'
      },{
        association: 'book',
        attributes: ['title'],
        key: 'refBook'
      }],
      nested: true 
    })

    const suggestions = await Suggestion.findAll({
      raw: true,
      where: {
        refSummary: id
      }
    })

    const checkSummary = await CheckSummary.findOne({
      where: {
        refSummary: id
      }
    })

    res.render('listSummary', { 
    summary: summary, 
    checkSummary: checkSummary,
    suggestions,
    menu: menu,
    admin: admin,
    volunteer: volunteer,
    profile: profile
    })
  }catch(error){
    throw new Error(error)
  }
}

async function listSummariesForEachUser(req, res) {
  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  const summaries = await listAllSummary(req, res)

  const ratings = await Rating.findAll({
    raw: true
  })
  
  res.render('listSummariesForEachUser', {  
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

async function listAllSummary() {
  try{
    Summary.belongsTo(User, {
      foreignKey: {
        name: 'refUser'
      }
  })

    Summary.belongsTo(Writer, {
        foreignKey: {
          name: 'refWriter'
        }
    })

    Summary.belongsTo(Book, {
        foreignKey: {
          name: 'refBook'
        }
    });  
    
    const summary = await Summary.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        association: 'writer',
        attributes: ['nameWriter'],
        key: 'refWriter'
      },{
        association: 'book',
        attributes: ['title'],
        key: 'refBook'
      },
      {
        association: 'user',
        attributes: ['id', 'fullName'],
        key: 'refUser'
      }],
      nested: true, 
    })

    return summary
  }catch(error){
    throw new Error(error)
  }
}

async function updateSummary(req, res) {
  const { id } = req.params
  const { body, refWriter, refUser, refBook } = req.body

  let status = 'Não Avaliado'
  try{
    await Summary.update({
      body,
      status,
      refWriter,
      refUser,
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
  const summaries = await listAllSummary();

  let profile = await getUserInformation(req, res);
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  const ratings = await Rating.findAll({
    raw: true
  })

  try{
    await Summary.destroy({
      where: { id: id }
    })
      res.render('listAllSummary', {  
        summaries: summaries, 
        ratings: ratings,
        message: "Excluído com sucesso", 
        messageError: false, 
        messageReport: false,
        menu: menu,
        admin: admin,
        volunteer: volunteer,
        profile: profile
    })
  }catch(error) {
    res.render('listAllSummary', {  
      summaries: summaries, 
      ratings: ratings,
      message: false, 
      messageError: "Não foi possível excluir depois de aprovado", 
      messageReport: false,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      profile: profile
  })
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

async function showSummary(req, res) {
  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelUser(profile)
  let volunteer = await getlevelVolunteer(profile)

  res.render("summary", { 
    messageError: false, 
    profile,
    menu,
    admin, 
    volunteer
  })
}


module.exports = { 
    searchTitleBook, 
    createSummary, 
    listAllSummary, 
    listSummary, 
    showAllBookToRegiterSummary,
    showAllSummary,
    showAllSummaryVolunteerToUp,
    listSummariesForEachUser,
    showSummary,
    updateSummary,
    deleteSummary
  }