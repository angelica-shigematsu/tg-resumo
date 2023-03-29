const Sequelize = require('sequelize');
const Op = Sequelize.Op
const Book = require("../model/Book")
const Rating = require("../model/Rating")
const Summary = require("../model/Summary")
const Volunteer = require("../model/User")
const Writer = require("../model/Writer")

async function searchSummary(req, res) {
  const { fieldSearch } = req.body
  let summaries = []

  if (!fieldSearch) res.render('listAllSummary', {messageError: 'O campo está vazio!'})

  try {
    await Summary.belongsTo(Volunteer, {
      foreignKey: {
        name: 'id'
      }})

      await Summary.belongsTo(Writer, {
        foreignKey: {
          name: 'refWriter'
        }})

      await Summary.belongsTo(Book, {
        foreignKey: {
          name: 'id'
        }});  

      const book = await Book.findOne({
        attributes: ['id', 'title'],
        where: { 
          title: { [Op.like]: `%${fieldSearch}%` }
        }
      })

      // writer = await Writer.findOne({
      //   where: { nameWriter: { [Op.like]: `%${fieldSearch}%`}},
      //   attributes: ['id'],
      // })

      summaries = await Summary.findAll({
        where: { id: book.id },
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

      if (!summaries.id)  res.render('listAllSummary', { messageError: `Não existe resumo com o título ${fieldSearch}`, messageReport: false })

    const ratings = await Rating.findAll({
      raw: true
    })

    res.render('listAllSummary', { summaries: summaries, ratings: ratings, messageError: false, messageReport: false })
 }catch(error) {
  res.render('listAllSummary', {messageError: `Não existe: ${fieldSearch}`})
 } 
}

module.exports = { searchSummary }