const Sequelize = require('sequelize');
const Op = Sequelize.Op
const Book = require('../model/Book')
const Rating = require('../model/Rating')
const Summary = require('../model/Summary')
const Volunteer = require('../model/User')
const Writer = require('../model/Writer');
const Favorite = require('../model/Favorite');
const User = require('../model/User');

async function searchBook(req, res) {
  const { fieldSearch } = req.body

  Book.belongsTo(Writer, {
    foreignKey: {
      name: 'refWriter'
    }
  })

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  try {
    const books = await Book.findAll({
      where: { 
        title: {  [Op.like]: `%${fieldSearch}%` }
      },
      include: [{
        association: 'writer',
        attributes: ['nameWriter'],
        key: 'refWriter'
      }],
      nest: true
    })

    if (!fieldSearch) {
      res.render('listAllBook', { 
        books: books,
        profile: profile,
        menu: menu,
        admin: admin,
        volunteer: volunteer,
       })
  }

  res.render('listAllBook', { 
    books: books,
    profile: profile,
    menu: menu,
    admin: admin,
    volunteer: volunteer,
   })

 }catch(error) {
  res.render('listAllBook', {
    books: [],
    profile: profile,
    menu,
    admin,
    volunteer,
    message: false,
    messageError: `Não existe: ${fieldSearch}`})
 } 
}

async function searchWriter(req, res) {
  const { fieldSearch } = req.body

  Book.belongsTo(Writer, {
    foreignKey: {
      name: 'refWriter'
    }
  })

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  try {
    const writers = await Writer.findAll({
    where: { 
      nameWriter: {  [Op.like]: `%${fieldSearch}%` }
    }
  })

    if (!fieldSearch) {
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

  res.render("listAllWriters", {
    writers: writers,
    message: false, 
    messageError: false,
    menu: menu,
    admin: admin,
    volunteer: volunteer,
    profile: profile
})

 }catch(error) {
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
}


async function searchSummary(req, res) {
  const { fieldSearch } = req.body
  let summaries = []

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  try {
    if (!fieldSearch) {
    return res.render('listAllSummary', {
      profile,
      menu,
      admin,
      volunteer,
      message: false,
      messageError: 'O campo está vazio!'
    })
  }
    Summary.belongsTo(Volunteer, {
      foreignKey: {
        name: 'refUser'
      }})
  
      Summary.belongsTo(Writer, {
        foreignKey: {
          name: 'refWriter'
        }})
  
      Summary.belongsTo(Book, {
        foreignKey: {
          name: 'refBook'
        }});  

      let book = await findBook(fieldSearch)

      if (!book) {
        const writer = await Writer.findOne({
          where: { 
            nameWriter: {  [Op.like]: `%${fieldSearch}%` }
          },
          attributes: ['idWriter', 'nameWriter'],
        })
        
        summaries = await Summary.findAll({
          where: {
            refWriter: writer.idWriter,
            status: "Aprovado"
          },
            include: [{
            association: 'writer',
            attributes: ['nameWriter'],
            key: 'refWriter'
          },{
            association: 'book',
            attributes: ['title'],
            key: 'refBook'
          },{
            association: 'user',
            attributes: ['id', 'fullName'],
            key: 'refUser'
          }]   
        })
      } else {
        summaries = await Summary.findAll({
          where: {
            refBook: book.id,
            status: "Aprovado"
          },
            include: [{
            association: 'writer',
            attributes: ['nameWriter'],
            key: 'refWriter'
          },{
            association: 'book',
            attributes: ['title'],
            key: 'refBook'
          },{
            association: 'user',
            attributes: ['id', 'fullName'],
            key: 'refUser'
          }]   
        })
      }

      if (!summaries[0].id) return res.render('listAllSummary', { 
        profile,
        menu,
        admin,
        volunteer,
        message: false,
        messageError: `Não existe resumo com o título ${fieldSearch}`, 
        messageReport: false 
      })

    let ratings = await Rating.findAll({
      raw: true
    })

    res.render('listAllSummary', { 
      summaries: summaries, 
      ratings, 
      profile: profile,
      menu,
      admin,
      volunteer,
      message: false,
      messageError: false, 
      messageReport: false 
    })
 }catch(error) {
  res.render('listAllSummary', {
    profile: profile,
    menu,
    admin,
    volunteer,
    message: false,
    messageError: `Não existe: ${fieldSearch}`})
 } 
}

async function searchByTitle(req, res) {
  const { searchSummary } = req.body
  let summaries = []

  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)


  Summary.belongsTo(Volunteer, {
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
    
  let book = await findBook(searchSummary)

  if (!book) {
    const writer = await Writer.findOne({
      where: { 
        nameWriter: {  [Op.like]: `%${searchSummary}%` }
      },
      attributes: ['idWriter', 'nameWriter'],
    })
    
    summaries = await Summary.findAll({
      where: {
        refWriter: writer.idWriter
      },
        include: [{
        association: 'writer',
        attributes: ['nameWriter'],
        key: 'refWriter'
      },{
        association: 'book',
        attributes: ['title'],
        key: 'refBook'
      },{
        association: 'user',
        attributes: ['id', 'fullName'],
        key: 'refUser'
      }]   
    })
  } else {
    summaries = await Summary.findAll({
      where: {
        refBook: book.id,
        status: "Aprovado"
      },
        include: [{
        association: 'writer',
        attributes: ['nameWriter'],
        key: 'refWriter'
      },{
        association: 'book',
        attributes: ['title'],
        key: 'refBook'
      },{
        association: 'user',
        attributes: ['id', 'fullName'],
        key: 'refUser'
      }]   
    })
  }

  if (!summaries[0].id) return res.render('listAllSummary', { 
    profile,
    menu,
    admin,
    volunteer,
    message: false,
    messageError: `Não existe resumo com o título ${fieldSearch}`, 
    messageReport: false 
  })

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

async function findBook(fieldSearch) {
  const book = await Book.findOne({
    where: { 
      title: { [Op.like]: `%${fieldSearch}%` }
    },
    attributes: ['id', 'title'],
  })
  return book
}

async function searchSummaryFavorite(req, res) {
  let favoriteSummaryId = []
  const { fieldSearch } = req.body
  let summaries = []

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  const favorites = await Favorite.findAll({
    where: { 
      refUser: profile.id,
    }
  })
  
  try {
    if (!fieldSearch) {
      return res.render('listAllFavorite', {
        profile,
        menu,
        admin,
        volunteer,
        messageError: 'O campo está vazio!'
      })
    }

    Summary.belongsTo(Volunteer, {
      foreignKey: {
        name: 'refUser'
      }})
  
      Summary.belongsTo(Writer, {
        foreignKey: {
          name: 'refWriter'
        }})
  
      Summary.belongsTo(Book, {
        foreignKey: {
          name: 'refBook'
        }});  

      const qtFavoriteSummaries = await Favorite.count({
        where: {
          refUser: profile.id
        }
      });

      for(let index = 0; index < qtFavoriteSummaries; index++) {
        favoriteSummaryId.push(favorites[index].refSummary)
      }

      let book = await findBook(fieldSearch)

      if (!book) {
        const writer = await Writer.findOne({
          where: { 
            nameWriter: {  [Op.like]: `%${fieldSearch}%` }
          },
          attributes: ['idWriter', 'nameWriter'],
        })
        
        summaries = await Summary.findAll({
          where: {
            id: favoriteSummaryId,
            refWriter: writer.idWriter,
            status: "Aprovado"
          },
            include: [{
            association: 'writer',
            attributes: ['nameWriter'],
            key: 'refWriter'
          },{
            association: 'book',
            attributes: ['title'],
            key: 'refBook'
          },{
            association: 'user',
            attributes: ['id', 'fullName'],
            key: 'refUser'
          }]   
        })
      } else {
        summaries = await Summary.findAll({
          where: {
            id: favoriteSummaryId,
            refBook: book.id,
            status: "Aprovado"
          },
            include: [{
            association: 'writer',
            attributes: ['nameWriter'],
            key: 'refWriter'
          },{
            association: 'book',
            attributes: ['title'],
            key: 'refBook'
          },{
            association: 'user',
            attributes: ['id', 'fullName'],
            key: 'refUser'
          }]   
        })
      }

      if (!summaries[0].id) return res.render('listAllFavorite', { 
        profile,
        menu,
        admin,
        volunteer,
        messageError: `Não existe resumo com o título ${fieldSearch}`, 
        messageReport: false 
      })

    let ratings = await Rating.findAll({
      raw: true
    })

    res.render('listAllFavorite', { 
      favorites: favorites,
      summaries: summaries, 
      ratings, 
      profile: profile,
      menu,
      admin,
      volunteer,
      messageError: false, 
      messageReport: false 
    })
 }catch(error) {
  res.render('listAllFavorite', {
    favorites: favorites,
    profile: profile,
    menu,
    admin,
    volunteer,
    messageError: `Não existe: ${fieldSearch}`})
 } 
}

async function searchByUser(req, res) {
  const { searchUser } = req.body
  let summaries = []

  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)
    
  const users = await User.findAll({
    where: { 
      fullName: {  [Op.like]: `%${searchUser}%` }
    }
  })

  if (!users) {
    res.render('listAllUser', { 
      users, 
      messageError: "Usuário não encontrado", 
      messageReport: false,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      profile: profile
    })
  }
  
  res.render('listAllUser', { 
    users, 
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
      const profile = await Volunteer.findOne({
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
  searchBook,
  searchWriter, 
  searchSummary,
  searchByTitle,
  searchSummaryFavorite,
  searchByUser
 }