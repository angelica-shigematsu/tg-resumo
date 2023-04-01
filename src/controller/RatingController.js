const Book = require('../model/Book')
const Writer = require('../model/Writer')
const Rating = require('../model/Rating')
const ListAllSummary = require('../controller/SummaryController')
const Summary = require('../model/Summary')
const Volunteer = require('../model/User')

async function createRating(req, res) {
  const { ratingStar, note, refUser, refSummary} = req.body
  try{
    const summaries = await ListAllSummary.listAllSummary()

    await Rating.create({
      ratingStar,
      note,
      refSummary,
      refUser
    })
    
    const ratings = await Rating.findAll({
      raw: true
    })
  
    res.render('listAllSummary', { summaries: summaries, ratings: ratings, messageError: false })

  }catch(err) {
    res.json('erro')
  }
}

async function listSummary(req, res) {
  const { id } = req.params

  const messageFavorite = false
  
  let profile = await getUserInformation(req, res);
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)

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
      menu: menu, 
      admin: admin
    })

  }catch(err){
    res.json("Não contém cadastros")
  } 
}

async function getSummary(id) {
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
  return summary
}

async function getRating(id) {
  const ratings = await Rating.findAll({
    raw: true,
    order: [['note', 'DESC']],
    where: {
      refSummary: id
    }
  })
  return ratings
}

async function listAllRatingByUser(req, res) {
  const { id } = req.params

  try{
    
     Summary.belongsTo(Volunteer, {
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
    return false
  else
    return true
}

module.exports = { 
  createRating, 
  listSummary, 
  listAllRatingByUser, 
  listRating,
  getRating,
  getSummary
 }