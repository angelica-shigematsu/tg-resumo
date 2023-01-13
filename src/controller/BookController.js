const Writer = require('../model/Writer')
const Book = require('../model/Book')
const WriterController = require('./WriterController')

async function getForeignKey(req, res){
  await Writer.findAll({ raw : true, order: [
    ['nameWriter', 'ASC']//ordem decrescente
  ]}).then(writers => {
    res.render("book", {
        writers: writers
    })
  })
}

async function createBook(req, res){
  const { title, publishingCompany, genre, year, refWriter } = req.body

  try{
    await Book.create({
      title,
      refWriter,
      publishingCompany,
      genre,
      year
    }).then(() => res.status(200).redirect("/livro/listaLivro"))
  }catch(err){
    res.json(err)
  }
}

async function listBook(req, res) {
  const { id } = req.params
  try {
    const book = await Book.findOne({
      include: [{
        association: 'writer',
        attributes: ['nameWriter']
      }],
      where: { id: id }
    })
    const writers = await WriterController.showAllWriters()
    res.render('listBook', { book: book, writers: writers })
  } catch (error) {
    res.json(error)
  }
}

async function listAllBook(req, res) {
  try {
    Book.belongsTo(Writer, {
      foreignKey: {
        name: 'id'
      }
    })

    await Book.findAll({
      raw: true,
      order: [['title', 'ASC']],
      include: [{
        association: 'writer',
        attributes: ['nameWriter']
      }]
    }).then(books => {
      let nameWriter = books[0]['writer.nameWriter']
      res.render('listAllBook', { books: books, writer: nameWriter })
    })
  } catch (error) {
    res.json(error)
  }
}

async function updateBook(req, res) {
  const { id } =  req.params
  const { title, publishingCompany, genre, year, refWriter } = req.body

  try {
    await Book.update({
      title,
      publishingCompany,
      genre,
      year,
      refWriter
    }, {
      where: { id: id }
    }).then(book => {
      res.redirect('/livro/listaLivro')
    })
  } catch (error) {
    res.json('Não existe livro cadastrado')
  }
}

async function deleteeBook(req, res) {
  const { id } = req.body

  try {
    await Book.destroy({
      where: { id: id }
    }).then(book => {
      res.redirect('/livro/listaLivro')
    })
  } catch (error) {
    res.json(error)
  }
}


module.exports = { 
  getForeignKey, 
  createBook, 
  listAllBook, 
  listBook,
  updateBook,
  deleteeBook
}