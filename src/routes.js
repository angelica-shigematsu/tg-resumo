const express = require('express')

const routes = express.Router()

const views = __dirname + "/views/"

const WriterController = require('./controller/WriterController')
const UserController = require('./controller/UserController')
const BookController = require('./controller/BookController')
const ProfileController = require('./controller/ProfileController')
const SummaryController = require('./controller/SummaryController')
const RatingController = require('./controller/RatingController')
const QuestionAndAnswerController = require('./controller/QuestionAndAswerController')
const CommentController = require('./controller/CommentController')

const { isAdmin, isAllLevel } = require('./middleware/IsAuthenticateByLevel')

const session = require('express-session')
const flash = require('connect-flash')

const passport = require('passport')

require('events').EventEmitter.prototype._maxListeners = 70;
require('events').defaultMaxListeners = 70;

process.on('warning', function (err) {
  if('MaxListenersExceededWarning' == err.name){
    console.log(err.name)
    process.exit(1)
  }
})
require('../config/auth')(passport)

routes.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true
}))
routes.use(passport.initialize())
routes.use(passport.session())
routes.use(flash())

routes.use((req, res, next) => {
  res.locals.success_msg = req.flash("Sucess message")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  next()
})

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

routes.get('/login', (req, res) => res.render(views + "index"))
routes.post('/login', (req, res, next) => {
  passport.authenticate('local',{
    successRedirect: "/menu",
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: true
  }
  )(req, res, next)
})

routes.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

routes.get('/menu', isAllLevel , (req, res) => res.render(views + "homepage"))

routes.get('/usuario/resumo', CommentController.listAllSummaryToUser)
routes.post('/usuario/comentario/:id', CommentController.searchDetailsSummary)
routes.post('/comentario', CommentController.createComment)

//Routes of Writer não alterar (finalizado)
routes.get('/autor', (req, res) => res.render(views + "registerWriter"))
routes.post('/autor', WriterController.createWriter)
routes.get('/autor/listEscritor/:id', WriterController.listWriter)
routes.get('/autor/listEscritor', WriterController.listAllWriter)
routes.post('/autor/alterar/:id', WriterController.updateWriter)
routes.post('/autor/excluir', WriterController.deleteWriter)
//

//Routes of Book
routes.get('/livro', BookController.getForeignKey)
routes.post('/livro', BookController.createBook)
routes.get('/livro/listaLivro', BookController.listAllBook)
routes.get('/livro/listaLivro/:id', BookController.listBook)
routes.post('/livro/alterar/:id', BookController.updateBook)
routes.post('/livro/excluir', BookController.deleteeBook)

//Route of Resumo
routes.get('/resumo', (req, res) => res.render(views + "summary"))
routes.post('/titulo', SummaryController.searchTitleBook)
routes.get('/resumo/submit', (req, res) => res.render(views + "summarySubmit"))
routes.post('/titulo/submit', SummaryController.createSummary)
routes.get('/resumo/listaResumo', SummaryController.showAllSummary)
routes.get('/resumo/listaResumo/:id', SummaryController.listSummary)
routes.post('/resumo/alterar/:id', SummaryController.updateSummary)
routes.post('/resumo/excluir', SummaryController.deleteSummary)


//Rating Summaries
routes.get('/resumo/avaliacao/:id', RatingController.listSummary)
routes.post('/resumo/avaliacao', RatingController.createRating)
//

routes.get('/questao', QuestionAndAnswerController.searchTitleBook)
routes.post('/questao', QuestionAndAnswerController.createQuestion)
routes.get('/questao/listaQuestionario', QuestionAndAnswerController.listAllQuestions)
routes.get('/questao/listaQuestionario/:id', QuestionAndAnswerController.listQuestion)
routes.post('/questao/alterar/:id', QuestionAndAnswerController.updateQuestion)
routes.post('/questao/excluir', QuestionAndAnswerController.deleteQuestion)

routes.get('/usuario', (req , res) => res.render(views + "user"))
routes.post('/usuario', UserController.createVolunteer)
routes.get('/usuario/listaUsuarios', UserController.listVolunteer)
routes.get('/usuario/:id', ProfileController.listProfile)
routes.post('/usuario/alterar/:id', UserController.updateVolunteer)

routes.get('/login', (req, res) => res.render(views + "index"))

module.exports = routes