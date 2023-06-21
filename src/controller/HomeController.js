const Book = require('../model/Book')
const Rating = require('../model/Rating')
const Summary = require('../model/Summary')
const User = require('../model/User')
const Writer = require('../model/Writer')

async function getRecentlySummaryPublished(req, res) {
  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  let booksId = []

  const summaries = await Summary.findAll({
    where: {
      status: 'Aprovado',
    },
    attributes: ['refBook'],
    group: 'refBook',
    order: [['createdAt', 'DESC']],
    limit: 4
  })

  const qtBook = await Summary.count({
    where: {
      status: 'Aprovado',
    },
    group: 'refBook',
    order: [['createdAt', 'DESC']],
    limit: 4
  })

  for(let index = 0; index < qtBook.length; index++) {
    booksId.push(summaries[index].refBook)
  }

  const books = await Book.findAll({
    where: {
      id: booksId
    }
  })

  if (profile.level == 'Administrador') {
    res.render('homepage', { books, menu: true, admin: true, volunteer: false, profile })
  }

  if(profile.level == 'Voluntario') {
    res.render('homepage', { books, menu: true, admin: false, volunteer: true, profile})
  }

  res.render('homepage', { books, menu: false, admin: false, volunteer: false, profile })
}

async function getAllSummariesByBook(req, res) {
  const { id } = req.params

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
    where: {
      status: 'Aprovado',
      refBook: id
    },
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
    summaries,
    ratings,
    message: false, 
    messageError: false, 
    messageReport: false,
    menu: menu,
    admin: admin,
    volunteer: volunteer,
    profile: profile
  })
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
  getAllSummariesByBook,
  getRecentlySummaryPublished
}