const express = require('express')

const routes = express.Router()

const views = __dirname + "/views/"

const WriterController = require('./controller/WriterController')
const VolunteerController = require('./controller/VolunteerController')

routes.get('/', (req, res) => res.render(views + "index"))
routes.get('/homepage', (req, res) => res.render(views + "homepage"))

routes.get('/autor', (req, res) => res.render(views + "registerWriter"))
routes.post('/autor', WriterController.createWriter)

routes.get('/registroLivro',(req, res) => res.render(views + "registerBook"))
routes.get('/avaliacaoResumo', (req, res) => res.render(views + "approvedReview"))


routes.get('/voluntario', (req , res) => res.render(views + "volunteer"))
routes.post('/voluntario', VolunteerController.createVolunteer)

module.exports = routes