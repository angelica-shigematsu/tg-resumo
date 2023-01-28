const Book = require("../model/Book")
const Rating = require("../model/Rating")
const Summary = require("../model/Summary")
const Volunteer = require("../model/User")
const Writer = require("../model/Writer")

async function searchSummary(req, res) {
  const { fieldSearch } = req.body


  await Summary.belongsTo(Volunteer, {
    foreignKey: {
      name: 'id'
    }})

    await Summary.belongsTo(Writer, {
      foreignKey: {
        name: 'id'
      }})

    await Summary.belongsTo(Book, {
      foreignKey: {
        name: 'id'
      }});  

  const book = await Book.findOne({
    attributes: ['id'],
    where: { 
      title: fieldSearch
    }
  })
  // const writer = await Writer.find({
  //   where: { 
  //     nameWriter: fieldSearch 
  //   }
  //  })

  const ratings = await Rating.findAll({
    raw: true
  })

  const summaries = await Summary.findAll({
    where: { refBook: book.id },
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

  // if (writer) {
  //   Summary.findAll({
  //   where: {
  //     ref
  //   }})
  // }

   res.render('listAllSummary', { summaries: summaries, ratings: ratings }) 
}

module.exports = { searchSummary }