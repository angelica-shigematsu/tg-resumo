const express = require('express')

const routes = express.Router()

const views = __dirname + "/views/"

const WriterController = require('./controller/WriterController')
const UserController = require('./controller/UserController')
const BookController = require('./controller/BookController')
const ProfileController = require('./controller/ProfileController')
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

routes.get('/login', (req, res) => res.render(views + "index"))
routes.post('/login', (req, res, next) => {
  passport.authenticate('local',{
    successRedirect: "/menu",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next)
})

routes.get('/menu', (req, res) => res.render(views + "homepage"))

//não alterar (finalizado)
routes.get('/autor', (req, res) => res.render(views + "registerWriter"))
routes.post('/autor', WriterController.createWriter)
routes.get('/autor/listEscritor/:id', WriterController.listWriter)
routes.get('/autor/listEscritor', WriterController.listAllWriter)
routes.post('/autor/alterar/:id', WriterController.updateWriter)
routes.post('/autor/excluir', WriterController.deleteWriter)
//

routes.get('/livro',(req, res) => res.render(views + "registerBook"))
routes.get('/avaliacaoResumo', (req, res) => res.render(views + "approvedReview"))

routes.get('/usuario', (req , res) => res.render(views + "user"))
routes.post('/usuario', UserController.createVolunteer)
routes.get('/usuario/listaUsuarios', UserController.listVolunteer)
routes.get('/usuario/:id', ProfileController.listProfile)

routes.get('/perfil/alterar/:id', ProfileController.listProfile)

module.exports = routes