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
const SuggestionContoller = require('./controller/SuggestionController')
const ResetPasswordController = require('./controller/ResetPasswordController')
const SendMailController = require('./controller/SendMailController')

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
  if(req.user.active == 'inativo')
    return res.render("index", {error: 'Sua está inativa ou espere alguns dias para avaliação do voluntário'})

  if(req.user.level == 'Usuario') 
    res.render("homepage", { menu: false, admin: false, volunteer: false, profile: req.user})
  
  if (req.user.level == 'Administrador') 
    res.render("homepage", { menu: true, admin: true, volunteer: false, profile: req.user })

  if (req.user.level == 'Voluntario') 
    res.render("homepage", { menu: true, admin: false, volunteer: true, profile: req.user })
})

//Routes of Writer não alterar (finalizado)
routes.get('/autor', isVolunteerOrAdmin, WriterController.getInformationMenu)
routes.post('/autor', isVolunteerOrAdmin, WriterController.createWriter)
routes.get('/autor/listEscritor/:id', isVolunteerOrAdmin, WriterController.listWriter)
routes.get('/autor/listEscritor', isVolunteerOrAdmin, WriterController.listAllWriter)
routes.post('/autor/alterar/:id', isVolunteerOrAdmin, WriterController.updateWriter)
routes.post('/autor/excluir', isVolunteerOrAdmin, WriterController.deleteWriter)
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
routes.get('/resumo/listaResumo/:id', isAllLevel, SummaryController.listSummary)
routes.post('/resumo/listaResumo/:id', isAllLevel,  SummaryController.listSummary)
routes.post('/resumo/alterar/:id', isAllLevel, SummaryController.updateSummary)
routes.post('/resumo/excluir', isAllLevel, SummaryController.deleteSummary)
routes.get('/resumo/admin', isVolunteerOrAdmin, SummaryController.showAllSummaryVolunteerToUp);
routes.get('/resumo/usuario', isAllLevel, SummaryController.listSummariesForEachUser)
routes.get('/resumo/favorito', isAllLevel, FavoriteController.listAllFavorite)

//Rating Summaries
routes.get('/resumo/:id', isAllLevel, RatingController.listSummary)
routes.post('/resumo/avaliacao', isAllLevel, RatingController.createRating)
routes.get('/resumo/listaAvaliacao/:id', isAllLevel, RatingController.listAllRatingByUser)
routes.get('/avaliacao/alterar/:id', isAllLevel, RatingController.listRating)

routes.get('/questao', isVolunteerOrAdmin, QuestionAndAnswerController.searchTitleBook)
routes.post('/questao', isVolunteerOrAdmin, QuestionAndAnswerController.createQuestion)
routes.get('/questao/listaQuestionario', isAllLevel, QuestionAndAnswerController.listAllQuestions)
routes.get('/questao/listaQuestionario/:id', isAllLevel, QuestionAndAnswerController.listQuestion)
routes.post('/questao/alterar/:id',isVolunteer, QuestionAndAnswerController.updateQuestion)
routes.post('/questao/excluir',isVolunteer, QuestionAndAnswerController.deleteQuestion)

routes.get('/questao/usuario/listaQuestionario/', isAllLevel, QuestionAndAnswerController.listAllQuestionsByUser)

routes.get('/usuario', (req , res) => res.render(views + "user", { user: false, message: false, messageError: false }))
routes.post('/usuario', UserController.createVolunteer, (req, res, next) => {
  passport.authenticate('local',{
    successRedirect: "/menu",
    failureRedirect: "/login",
    failureFlash: true,
    failureMessage: true
  }
  )(req, res, next)
})
routes.get('/usuario/listaUsuarios', isAdmin, UserController.listVolunteer)
routes.get('/perfil', isAllLevel, ProfileController.showUserPage)
routes.get('/usuario/:id', isAllLevel, ProfileController.listProfile)
routes.post('/usuario/alterar/:id', isAllLevel, UserController.updateVolunteer)

routes.post('/nav', isAllLevel, SearchController.searchSummary)
routes.post('/nav/favorito', isAllLevel, SearchController.searchSummaryFavorite)
routes.post('/usuario/nav', isAllLevel, SearchController.searchByTitle)
routes.post('/nav/usuario', isAllLevel, SearchController.searchByUser)

routes.get('/login', (req, res) => res.render(views + "index", { error: false }))

routes.get('/denuncia', isAdmin, ReportController.getInformationReport)
routes.post('/denuncia', isAllLevel, ReportController.createReport)
routes.get('/denuncia/resumo/:id', ReportController.listFormsToReport)
routes.post('/denuncia/avaliacao/:id', isAdmin, ReportController.getReport)
routes.post('/denuncia/avaliado/:id', isAdmin, ReportController.updateReport)

routes.get('/denuncia/usuario', isAllLevel, ReportController.getAllReportByUser)
routes.get('/denuncia/usuario/:id', isAllLevel, ReportController.getReportToUser)
routes.post('/denuncia/alterar/:id', isAllLevel, ReportController.updateReportToUser)
routes.post('/denuncia/excluir', ReportController.deleteSummary)


routes.get('/correcao/resumo', isVolunteerOrAdmin, CheckSummarysController.showInformationAllSummary)
routes.get('/correcao/resumo/:id', isVolunteerOrAdmin, CheckSummarysController.getInformationSummary)
routes.post('/correcao/resumo/:id', isVolunteerOrAdmin, CheckSummarysController.createCheckedSummary)

routes.post('/favoritar', isAllLevel, FavoriteController.createFavorite)

routes.post('/sugestao', isAllLevel, SuggestionContoller.createSuggestion)

routes.get('/modificarsenha', SendMailController.getMail)
routes.post('/modificarsenha', ResetPasswordController.resetPassword)

routes.get('/enviarMensagem', (req, res) => { res.render(views + "sendResetPassword", { messageError: false, message: false }) })
routes.post('/enviarMensagem', SendMailController.sendMail)

routes.get('/sobre', (req, res) => res.render(views + "about"))

module.exports = routes