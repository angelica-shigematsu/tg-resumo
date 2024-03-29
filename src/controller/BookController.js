const Writer = require('../model/Writer')
const Book = require('../model/Book')
const WriterController = require('./WriterController')
const Volunteer = require('../model/User.js')

async function getForeignKey(req, res){
  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  await Writer.findAll({ raw : true, order: [
    ['nameWriter', 'ASC']//ordem decrescente
  ]}).then(writers => {
    res.render("book", {
        writers: writers,
        profile: profile,
        menu: menu,
        admin: admin,
        volunteer: volunteer
    })
  })
}

async function createBook(req, res){
  const { title, genre, refWriter, photo_link } = req.body

  try{
    await Book.create({
      title,
      refWriter,
      genre,
      photo_link
    }).then(() => res.status(200).redirect("/livro/listaLivro"))
  }catch(err){
    res.json(err)
  }
}

async function listBook(req, res) {
  const { id } = req.params

  const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)
    
  try {
    const book = await Book.findOne({
      include: [{
        association: 'writer',
        attributes: ['nameWriter']
      }],
      where: { id: id }
    })
    const writers = await WriterController.showAllWriters()
    res.render('listBook', {
      book: book, writers: writers,  
      profile: profile,
      menu: menu,
      admin: admin,
      volunteer: volunteer })
  } catch (error) {
    res.json(error)
  }
}

async function listAllBook(req, res) {
  try {
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    Book.belongsTo(Writer, {
      foreignKey: {
        name: 'refWriter'
      }
    })

    await Book.findAll({
      raw: true,
      order: [['title', 'ASC']],
      include: [{
        association: 'writer',
        attributes: ['nameWriter'],
        key: 'refWriter'
      }],
      nest: true
    }).then(books => {
      res.render('listAllBook', { 
        books: books,
        profile: profile,
        menu: menu,
        admin: admin,
        volunteer: volunteer,
       })
    })
  } catch (error) {
    res.json(error)
  }
}

async function updateBook(req, res) {
  const { id } =  req.params
  const { title, genre, refWriter, photo_link } = req.body

  try {
    await Book.update({
      title,
      genre,
      refWriter, 
      photo_link
    }, {
      where: { id: id }
    }).then(book => {
      res.redirect('/livro/listaLivro')
    })
  } catch (error) {
    res.json('Não existe livro cadastrado')
  }
}

async function deleteBook(req, res) {
  const { id } = req.body

  try {
    await Book.destroy({
      where: { id: id }
    }).then(() => {
      res.redirect('/livro/listaLivro')
    })
  } catch (error) {
    res.json(error)
  }
}
async function getUserInformation(req, res) {
  if (req.isAuthenticated()) {
      const  { email } = req.user
      const profile = await Volunteer.findOne({
        where: { email: email}
    })
    return profile
  }
}

async function getlevelUser(profile) {
  if (profile.level == 'Usuario')
    return false
  else
    return true
}

async function getlevelAdmin(profile) {
  if (profile.level == 'Administrador')
    return true
  else
    return false
}

async function getlevelVolunteer(profile) {
  if (profile.level == 'Voluntario')
    return true
  else
    return false
}

module.exports = { 
  getForeignKey, 
  createBook, 
  listAllBook, 
  listBook,
  updateBook,
  deleteBook
}