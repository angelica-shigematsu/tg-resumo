const Writer = require('../model/Writer')
const Book = require('../model/Book')

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
  const { title } = req.body
  const { publishingCompany } = req.body
  const { genre } = req.body
  const { year } = req.body
  const { refWriter } = req.body

  try{
    await Book.create({
      title,
      refWriter,
      publishingCompany,
      genre,
      year
    }).then(() => res.status(200).redirect("/listBook"))
  }catch(err){
    res.send(err)
  }
}

module.exports = { getForeignKey, createBook }