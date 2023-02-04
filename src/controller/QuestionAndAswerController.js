const Book = require('../model/Book')
const QuestionAndAnswer = require('../model/QuestionAndAnswer')

async function searchTitleBook(req, res) {
  try {
    await Book.findAll({
      raw : true, 
      order: [
         ['title', 'ASC']
      ]
    }).then((books) => {
      res.render('registerQuestion', { books: books })
    })
  } catch (error) {
    res.json()
  }
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

  try{
    QuestionAndAnswer.belongsTo(Book, {
      foreignKey: {
        name: 'id'
      }
    })

    await QuestionAndAnswer.findAll({
      attributes: ['id', 'question', 'answer'],
      include: [{
        association: 'book',
        attributes: ['title', 'id']
      }]
    }).then(questions => {
      res.render('listAllQuestion', { questions: questions })
    })
  }catch(error) {
    res.json(error)
  }

}

async function listQuestion(req, res) {
  const { id } = req.params

  try{
    const question = await QuestionAndAnswer.findOne({
      where: { id: id }
    })
  
    const book = await showTitleBookByQuestion(question.refBook)
    console.log(question.answer)

    res.render('listQuestion', { question: question, book: book})
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

module.exports = { createQuestion, listQuestion, searchTitleBook, listAllQuestions, updateQuestion, deleteQuestion }