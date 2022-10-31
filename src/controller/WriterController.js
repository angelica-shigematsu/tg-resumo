const Writer = require('../model/Writer')

async function createWriter(req, res) {
  const { nameWriter } = req.body
  const { dateBirthWriter } = req.body

  try {
    await Writer.create({
    nameWriter,
    dateBirthWriter
  }).then(() => res.redirect('/listEscritor'))
  }catch(error){
    throw new Error(error)
  }
}

async function listAllWriter(req, res) {
  await Writer.findAll({raw : true, order: [
    ['nameWriter', 'ASC']//ordem decrescente
  ]}).then(writers=> {
    res.render("listAllWriters",{
        writers: writers
    });
});
} 

async function listWriter(req, res) {
  const { id } = req.params

  const numberId = Number(id)

  if(isNaN(numberId)) return res.redirect("listEscritor")

    Writer.findOne({idWriter: numberId}).then(writers => {
    if(!writers) return res.redirect("listEscritor")

    res.render("listWriter.ejs", { writers: writers })
  })
} 

async function updateWriter(req, res) {
  const { idWriter } = req.body
  const { nameWriter } = req.body
  const { dateBirthWriter } = req.body

  await Writer.update({
    nameWriter,
    dateBirthWriter
  },{
    where: {
    idWriter
  }}).then(writer => {
    console.log(writer)
    res.render('/', { writer: writer })
  }).catch(error => {
    res.status(400).json('Error')
  })
}

async function deleteWriter( req, res) {
  const { writerId } = req.params

  await Writer.delete(writerId)

  return res.redirect('/')
}

module.exports = { createWriter, listAllWriter, listWriter, updateWriter, deleteWriter  }