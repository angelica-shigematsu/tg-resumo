const Book = require('../model/Book')
const Writer = require('../model/Writer')
const Rating = require('../model/Rating')
const ListAllSummary = require('../controller/SummaryController')
const Summary = require('../model/Summary')
const User = require('../model/User')

async function createRating(req, res) {
  const { ratingStar, note, refSummary} = req.body
  try{
    let profile = await getUserInformation(req, res);
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)
    const summaries = await ListAllSummary.listAllSummary(req, res)

    await Rating.create({
      ratingStar,
      note,
      refSummary,
      refUser: profile.id
    })
    
    const ratings = await Rating.findAll({
      raw: true
    })
  
    res.render('listAllSummary', { 
      summaries: summaries, 
      ratings: ratings, 
      menu,
      admin,
      volunteer,
      profile,
      message: false,
      messageError: false 
    })

  }catch(err) {
    res.json('erro')
  }
}

async function listSummary(req, res) {
  const { id } = req.params
  
  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  try{
    const refUserComment = await getUserInformation(req, res);

    const summary = await getSummary(id);

    const ratings = await getRating(id);
    
    res.render('rating', { 
      book: summary.book.title,   
      ratings: ratings,
      summary: summary,
      volunteer: summary.user.fullName, 
      writer: summary.writer.nameWriter, 
      messageFavorite: false,
      refUserComment: refUserComment,
      profile,
      menu: menu, 
      admin: admin,
      volunteer: volunteer
    })

  }catch(err){
    res.json("Não contém cadastros")
  } 
}

async function getSummary(id) {

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
    }] 
  })

  return summary
}

async function getRating(id) {
  Rating.belongsTo(User, {
    foreignKey: {
      name: 'refUser'
    }
  })
  const ratings = await Rating.findAll({
    where: {
      refSummary: id
    },
    include: [{
      association: 'user',
      attributes: ['fullName'],
      key: 'refUser'
    }],
    nested: true
  })
  return ratings
}

async function listAllRatingByUser(req, res) {
  const { id } = req.params

  try{
    let profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile)
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)
    
     Summary.belongsTo(User, {
      foreignKey: {
        name: 'id'
      }})
    
      const ratings = await Rating.findAll({
        attributes: ['refSummary', 'ratingStar', 'createdAt', 'note', 'id'],
        raw: true,
        where: {
          refUser: id
        }
      })

    res.render('listRatingByUser', { 
      profile,
      menu,
      admin,
      volunteer,
      ratings: ratings,
    })

  }catch(err){
    res.json(err)
  } 
}

async function listRating(req, res) {
  const { id } = req.params

  try{
      const rating = await Rating.findOne({
        where: { id: id }
      })
  
      res.render('listRating', {  
        rating: rating
      })

  }catch(err){
    res.json("Não contém cadastros")
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
  createRating, 
  listSummary, 
  listAllRatingByUser, 
  listRating,
  getRating,
  getSummary
 }