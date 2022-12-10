const Book = require('../model/Book')
const Writer = require('../model/Writer')

async function searchTitleBook(req, res) {
  const { title } = req.body

  try{
    let book = await Book.findAll({ attributes: ['refWriter', 'title'], where: { title: title }})
    let idWriter = book[0].refWriter

    let writer = await Writer.findAll({ where: { idWriter : idWriter }})
    res.render("summarySubmit", { book: { title: book[0].title, refWriter: book[0].refWriter}, writer: {nameWriter: writer[0].nameWriter}})
  }catch(error){
    res.status(400).send('Erro ao encontrar livro!')
  }
}

async function createWriter(req, res) {
  const { id, refWriter, refVolunteer } = req.body

  try{
    await Summary.create({
    id,
    body,
    refWriter,
    refVolunteer
  }).then(() => res.status(200).redirect("/listEscritor"))
  }catch(error){
    res.status(400).send('Erro ao criar escritor!')
  }
}

module.exports = { searchTitleBook, createWriter }