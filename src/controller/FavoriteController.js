const Book = require('../model/Book');
const Favorite = require('../model/Favorite');
const Rating = require('../model/Rating');
const Summary = require('../model/Summary');
const User = require('../model/User');
const Volunteer = require('../model/User');
const Writer = require('../model/Writer');
const sequelize = require('sequelize');
const { getSummary, getRating } = require('./RatingController');

async function createFavorite(req, res) {
  const { refUser, refSummary } = req.body

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)
  let created_at = new Date();

  try{

    const refUserComment = await getUserInformation(req, res);
    
    const summary = await getSummary(refSummary);

    const ratings = await getRating(refSummary);

    const hasAddOnFavorite = await Favorite.findOne({
      where: { 
        refUser: profile.id,
        refSummary: refSummary
      }
    })
    
    if(hasAddOnFavorite) { 
      return res.render('rating', { 
        book: summary.book.title,   
        ratings: ratings,
        summary: summary,
        volunteer: summary.user.fullName, 
        writer: summary.writer.nameWriter, 
        messageFavorite: 'Já foi adiconado como favorito',
        refUserComment: refUserComment,
        profile,
        menu: menu, 
        admin: admin,
        volunteer: volunteer
    })
  }

    await Favorite.create({
      created_at,
      refSummary,
      refUser, 
    })

    res.render('rating', { 
      book: summary.book.title,   
      ratings: ratings,
      summary: summary,
      volunteer: summary.user.fullName, 
      writer: summary.writer.nameWriter, 
      messageFavorite: 'Adicionado como favorito com sucesso',
      refUserComment: refUserComment,
      profile,
      menu: menu, 
      admin: admin,
      volunteer: volunteer
    })
  }catch(err) {
    res.json('erro')
  }
}

async function listAllFavorite(req, res) {
  let favoriteSummaryId = []
  let summaries = []
  let ratings = []

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  Favorite.belongsTo(Summary, {
    foreignKey: {
      name: 'refSummary'
    }
  })

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

  const qtFavoriteSummaries = await Favorite.count({
    where: {
      refUser: profile.id
    }
  });

  const favorites = await Favorite.findAll({
    where: { 
      refUser: profile.id,
    }
  })

  ratings = await Rating.findAll({
    raw: true
  })

  if (qtFavoriteSummaries == 0 ) {
    await res.render('listAllFavorite', { 
    favorites: favorites, 
    summaries: summaries, 
    ratings: ratings, 
    messageError: 'Você não tem nenhum resumo favoritado', 
    messageReport: false,
    menu: menu,
    admin: admin,
    volunteer: volunteer,
    profile: profile
   })
  }
  
  for(let index = 0; index < qtFavoriteSummaries; index++) {
    favoriteSummaryId.push(favorites[index].id)
  }

  summaries = await Summary.findAll({
    where: {
      id: favoriteSummaryId
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
    
  await res.render('listAllFavorite', { 
    favorites: favorites, 
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

async function getlevelVolunteer(profile) {
  if (profile.level == 'Voluntario')
    return true
  else
    return false
}

async function getlevelAdmin(profile) {
  if (profile.level == 'Administador')
    return true
  else
    return false
}


module.exports = { 
  createFavorite,
  listAllFavorite
 }