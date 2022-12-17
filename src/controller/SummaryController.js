const Book = require('../model/Book')
const Writer = require('../model/Writer')
const Summary = require('../model/Summary')

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
  }).then(() => res.status(200).redirect("/listEscritor"))
  }catch(error){
    res.status(400).send('Erro ao criar escritor!')
  }
  
}

module.exports = { searchTitleBook, createSummary }