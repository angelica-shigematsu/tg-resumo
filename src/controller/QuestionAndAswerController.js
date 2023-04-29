const Book = require('../model/Book')
const QuestionAndAnswer = require('../model/QuestionAndAnswer')
const User = require('../model/User')

async function searchTitleBook(req, res) {
  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  await Book.findAll({
    raw : true, 
    order: [
        ['title', 'ASC']
    ]
  }).then((books) => {
    res.render('registerQuestion', { 
      books: books,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      profile: profile  
    })
  })
}

async function showTitleBookByQuestion(id) {
  try {
    const bookTitle = await Book.findOne({
      attributes: [ 'title', 'id' ],
      where: { id: id }
    })
    return bookTitle;
  } catch (error) {
    res.json(error)
  }
}

async function createQuestion(req, res) {
  try {
    const { question, answer, refBook, refVolunteer } = req.body

    await QuestionAndAnswer.create({
      question,
      answer,
      refBook,
      refVolunteer
    }).then(() => {
      res.redirect('/questao/listaQuestionario')
    })
  } catch (error) {
    res.json(error)
  }
  
}

async function listAllQuestions(req, res) {

    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    QuestionAndAnswer.belongsTo(Book, {
      foreignKey: {
        name: 'refBook'
      }
    })

    const questions = await QuestionAndAnswer.findAll({
      attributes: ['id', 'question', 'answer'],
      include: [{
        association: 'book',
        attributes: ['title', 'id'],
        key: 'refBook'
      }]
    })

    res.render('listAllQuestion', { 
      questions: questions,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      profile: profile 
    })
}

async function listQuestion(req, res) {
  const { id } = req.params

  try{
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile);
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    QuestionAndAnswer.belongsTo(User, {
      foreignKey: {
        name: 'refVolunteer'
      }
    })

    const question = await QuestionAndAnswer.findOne({
      where: { id: id },
      include: [{
        association: 'user',
        attributes: ['fullName'],
        key: 'refVolunteer'
      }],
      nested: true
    })
    console.log(question)
    const book = await showTitleBookByQuestion(question.refBook)

    res.render('listQuestion', { 
      question: question, 
      book: book,
      menu: menu,
      admin: admin,
      volunteer: volunteer,
      profile: profile 
    })
  }catch(error) {
    res.json(error)
  }
}

async function updateQuestion(req, res) {
  const { id } = req.params
  const { question, answer, refBook, refVolunteer } = req.body

  try {
    await QuestionAndAnswer.update({
      question,
      answer,
      refBook,
      refVolunteer
    }, { 
      where: { 
        id: id 
      }
    }).then(() => {
      res.redirect('/questao/listaQuestionario');
    })
  } catch (error) {
    res.json("Não existe esse questionário cadastrado")
  }
}

async function deleteQuestion(req, res) {
  const { id } = req.body

  console.log(id)
  try{
    await QuestionAndAnswer.destroy({
      where: { id: id }
    }).then(() => {
      res.redirect('/questao/listaQuestionario');
    })
  }catch(error) {
    res.json()
  }
}

async function getUserInformation(req, res) {
  if (req.isAuthenticated()) {
      const  { email } = req.user
      const profile = await User.findOne({
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
  createQuestion, 
  listQuestion, 
  searchTitleBook, 
  listAllQuestions, 
  updateQuestion, 
  deleteQuestion 
}