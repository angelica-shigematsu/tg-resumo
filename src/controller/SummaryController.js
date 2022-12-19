const Book = require('../model/Book')
const Writer = require('../model/Writer')
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
 
  const { body } = req.body
  const { refWriter } = req.body
  const { refVolunteer } = req.body
  const { refBook } = req.body

  try{
    await Summary.create({
    body,
    refWriter,
    refVolunteer,
    refBook
  }).then(() => res.status(200).redirect("/listaResumo"))
  }catch(error){
    res.status(400).send('Erro ao criar resumo!')
  } 
}

async function listAllSummary(req, res) {
  
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

      Summary.findAll({
        attributes: ['body'],
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
    }).then(descriptionNames => {
      res.json(descriptionNames)
    });
  }catch(err){
    res.json(err)
  }
}


module.exports = { searchTitleBook, createSummary, listAllSummary}