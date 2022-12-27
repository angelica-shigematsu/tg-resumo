const Book = require('../model/Book')
const Writer = require('../model/Writer')
const Rating = require('../model/Rating')
const ListAllSummary = require('../controller/SummaryController')
const Summary = require('../model/Summary')
const Volunteer = require('../model/User')

async function createRating(req, res) {
  const { ratingStar, note, refUser, refSummary} = req.body
  try{
    const summaries = await ListAllSummary.listAllSummary(req, res)

    await Rating.create({
      ratingStar,
      note,
      refSummary,
      refUser
    }).then((ratings) => {
        res.render('listAllSummary', {summaries: summaries, ratings: ratings })
    }) 
  }catch(err) {
    res.json('erro')
  }
}

// async function averageRating(id) {
//   let averageRate = 0
//   await Rating.findAll({
//     where: { id: id }
//   }).then((rating) => {
//     for(let sumRate; sumRate<= sumRate.length(); sumRate++) {
//       averageRate += rating.ratingStar
//     }
//     averageRate /= sumRate.length()
//   })
//   return averageRate
// }

async function listSummary(req, res) {
  const { id } = req.params

  try{
    const value = Summary.belongsTo(Volunteer, {
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

      await Summary.findOne({
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
      
    }).then(summary => {
      res.render('rating', { 
        summary: summary,
        book: summary.book.title , 
        volunteer: summary.user.fullName, 
        writer: summary.writer.nameWriter})
    })
  }catch(err){
    res.json("Não contém cadastros")
  } 
}

module.exports = { createRating, listSummary }