const Book = require('../model/Book')
const Writer = require('../model/Writer')
const Rating = require('../model/Rating')
const Summary = require('../model/Summary')
const Volunteer = require('../model/User')


async function searchTitleBook(req, res) {
  const { title } = req.body

  try{
    let book = await Book.findOne({ attributes: ['refWriter', 'title', 'id'], where: { title: title }})
    let idWriter = book.refWriter
    let writer = await Writer.findOne({ where: { idWriter : idWriter }})

    res.render("summarySubmit", { book: { id: book.id, title: book.title, refWriter: book.refWriter}, writer: {nameWriter: writer.nameWriter}})
  }catch(error){
    res.status(400).send('Erro ao encontrar livro!')
  }
}

async function createSummary(req, res) {
 
  const { body, refWriter, refVolunteer, refBook } = req.body

  try{
    await Summary.create({
    body,
    refWriter,
    refVolunteer,
    refBook
  }).then(() => showAllSummary())
  }catch(error){
    res.status(400).send('Erro ao criar resumo!')
  } 
}

async function showAllSummary(req, res) {
  const summaries = await listAllSummary();
  const ratings = await Rating.findAll({
    raw: true
  })

  res.render('listAllSummary', { summaries: summaries, ratings: ratings })
}

async function listSummary(req, res) {
  try{
  const { id } = req.params

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
  }).then(summary => async() =>{
    await res.render('listSummary', { 
      summary: summary,
      book: summary.book.title , 
      volunteer: summary.user.fullName, 
      writer: summary.writer.nameWriter})
  })
  }catch(err){
    res.json(err)
  } 
}
async function listAllSummary() {
  try{
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

      const summary = await Summary.findAll({
        attributes: ['body', 'id', 'refBook'],
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
  }catch(error){
    throw new Error(error)
  }
}

async function updateSummary(req, res) {
  const { id } = req.params
  const { body, refWriter, refVolunteer, refBook } = req.body

  try{
    await Summary.update({
      body,
      refWriter,
      refVolunteer,
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

  try{
    await Summary.destroy({
      where: { id: id }
    }).then(() => {
      res.redirect('/resumo/listaResumo')
    })
  }catch(err) {
    res.redirect('/resumo/listaResumo')
  }
}


module.exports = { 
    searchTitleBook, 
    createSummary, 
    listAllSummary, 
    listSummary, 
    showAllSummary,
    updateSummary,
    deleteSummary
  }