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
    const ratings = await Rating.findAll({
      raw: true,
      order: [['note', 'DESC']],
      where: {
        refSummary: id
      }
    })
      res.render('rating', { 
        book: summary.book.title,   
        ratings: ratings,
        summary: summary,
        volunteer: summary.user.fullName, 
        writer: summary.writer.nameWriter})

  }catch(err){
    res.json("Não contém cadastros")
  } 
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

module.exports = { createRating, listSummary, listAllRatingByUser, listRating }