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
const SearchController = require('./controller/SearchController')
const ReportController = require('./controller/ReportController')
const FavoriteController = require('./controller/FavoriteController')
const CheckSummarysController = require('./controller/CheckSummaryController')

const { isAdmin, isUser, isAllLevel, isVolunteer, isVolunteerOrAdmin } = require('./middleware/IsAuthenticateByLevel')

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

routes.get('/menu', isAllLevel, (req, res) => {
  if(req.user.level == 'Usuario') 
    res.render("homepage", { menu: false, admin: false, volunteer: false })
  
  if (req.user.level == 'Administrador') 
    res.render("homepage", { menu: true, admin: true, volunteer: false })

  if (req.user.level == 'Voluntario') 
    res.render("homepage", { menu: true, admin: false, volunteer: true })
})

//Routes of Writer não alterar (finalizado)
routes.get('/autor', (req, res) => res.render(views + "registerWriter", { message: false,  messageError: false }))
routes.post('/autor', WriterController.createWriter)
routes.get('/autor/listEscritor/:id', WriterController.listWriter)
routes.get('/autor/listEscritor', WriterController.listAllWriter)
routes.post('/autor/alterar/:id', WriterController.updateWriter)
routes.post('/autor/excluir', WriterController.deleteWriter)
//

//Routes of Book
routes.get('/livro', isVolunteerOrAdmin, BookController.getForeignKey)
routes.post('/livro', isVolunteerOrAdmin, BookController.createBook)
routes.get('/livro/listaLivro', isVolunteerOrAdmin, BookController.listAllBook)
routes.get('/livro/listaLivro/:id', isVolunteerOrAdmin, BookController.listBook)
routes.post('/livro/alterar/:id', isVolunteerOrAdmin, BookController.updateBook)
routes.post('/livro/excluir', isVolunteerOrAdmin, BookController.deleteBook)

//Route of Resumo
routes.get('/resumo', isAllLevel, SummaryController.showSummary)
routes.post('/titulo', isAllLevel, SummaryController.searchTitleBook)
routes.get('/resumo/submit',isAllLevel, (req, res) => res.render(views + "summarySubmit"))
routes.post('/titulo/submit', isAllLevel,  SummaryController.createSummary)
routes.get('/resumo/listaResumo', isAllLevel, SummaryController.showAllSummary)
routes.post('/resumo/listaResumo/:id', isAllLevel,  SummaryController.listSummary)
routes.post('/resumo/alterar/:id', isAllLevel, SummaryController.updateSummary)
routes.post('/resumo/excluir', isAllLevel, SummaryController.deleteSummary)
routes.get('/resumo/admin', isVolunteerOrAdmin, SummaryController.showAllSummaryVolunteerToUp);

// //Rating Summaries
routes.get('/resumo/:id', isAllLevel, RatingController.listSummary)
routes.post('/resumo/avaliacao', RatingController.createRating)
routes.get('/resumo/listaAvaliacao/:id', RatingController.listAllRatingByUser)
routes.get('/avaliacao/alterar/:id', RatingController.listRating)

routes.get('/questao', QuestionAndAnswerController.searchTitleBook)
routes.post('/questao', QuestionAndAnswerController.createQuestion)
routes.get('/questao/listaQuestionario', QuestionAndAnswerController.listAllQuestions)
routes.get('/questao/listaQuestionario/:id', QuestionAndAnswerController.listQuestion)
routes.post('/questao/alterar/:id', QuestionAndAnswerController.updateQuestion)
routes.post('/questao/excluir', QuestionAndAnswerController.deleteQuestion)

routes.get('/usuario', (req , res) => res.render(views + "user", { message: false, messageError: false }))
routes.post('/usuario', UserController.createVolunteer)
routes.get('/usuario/listaUsuarios', isAdmin, UserController.listVolunteer)
routes.get('/perfil', isAllLevel, ProfileController.showUserPage)
routes.get('/usuario/:id', ProfileController.listProfile)
routes.post('/usuario/alterar/:id', UserController.updateVolunteer)
routes.post('/usuario/excluir', UserController.deleteUser)

routes.post('/nav', isAllLevel, SearchController.searchSummary)

routes.get('/login', (req, res) => res.render(views + "index", { error: false }))

routes.get('/denuncia', isAdmin, ReportController.getInformationReport)
routes.post('/denuncia', isAllLevel, ReportController.createReport)
routes.get('/denuncia/usuario', isAdmin, ReportController.getAllReportByUser)
routes.post('/denuncia/avaliacao/:id', isVolunteer, ReportController.getReport)
routes.post('/denuncia/avaliado/:id', isVolunteer, ReportController.updateReport)
// routes.post('/denuncia/alterar/:id', ReportController.updateReport)
routes.get('/denuncia/usuario/:id', ReportController.getAllReportByUser)
routes.post('/denuncia/excluir', ReportController.deleteReport)

routes.get('/correcao/resumo', isVolunteerOrAdmin, CheckSummarysController.showInformationAllSummary)
routes.get('/correcao/resumo/:id', isVolunteerOrAdmin, CheckSummarysController.getInformationSummary)
routes.post('/correcao/resumo/:id', isVolunteerOrAdmin, CheckSummarysController.createCheckedSummary)

routes.post('/favoritar', isAllLevel, FavoriteController.createFavorite)

module.exports = routes