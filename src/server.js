const express = require('express')
const app = express()
const routes = require("./routes")
const path = require("path")

const connection = require('./database/config')
const bookModel = require("./database/Book")
const writerModel = require('./database/Writer')

connection.authenticate()
  .then(() => {
    console.log('Conexão com sucesso');
  })
  .catch((msgError) => {
    console.log(msgError);
  })

app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'))

console.log(__dirname)
app.use(express.static("public"))

app.use(express.urlencoded({ extended: true }))

app.use(routes)
  
app.listen(3000,() => console.log('rodando'))