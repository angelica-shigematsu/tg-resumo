const Writer = require('../model/Writer')

async function createWriter(req, res) {
  const { nameWriter } = req.body
  const { dateBirthWriter } = req.body

  try{
    if(!nameWriter && !dateBirthWriter) res.status(400).send('Campos inválido')
    
    await Writer.create({
    nameWriter,
    dateBirthWriter
  }).then(() => res.status(200).redirect("/listEscritor"))
  }catch(error){
    res.status(400).send('Erro ao criar escritor!')
  }
}

async function listAllWriter(req, res) {
  await Writer.findAll({ raw : true, order: [
    ['nameWriter', 'ASC']//ordem decrescente
  ]}).then(writers => {
    res.render("listAllWriters", {
        writers: writers
    })
  })
} 

async function listWriter(req, res) {
  const { id } = req.params

  const numberId = Number(id)

  if(isNaN(numberId)) return res.redirect("/autor/listEscritor")

    await Writer.findByPk(numberId).then(writers => {
    if(!writers) return res.redirect("listEscritor")

    res.render("listWriter", { writers: writers })
  })
} 

async function updateWriter(req, res) {
  const { id } = req.params
  const { nameWriter } = req.body
  const { dateBirthWriter } = req.body

  if(!nameWriter && !dateBirthWriter )  res.render("listAllWriters")

  try{
    await Writer.update({
      nameWriter,
      dateBirthWriter
    },{
      where: {
        idWriter: id
    }}).then(() => {
      res.redirect("../../autor/listEscritor")
    })
  }catch(err) {
    res.status(400).send('Erro em atualizar os dados do Escritor')
  }
}

async function deleteWriter( req, res) {
  const { id } = req.body

  try{
    await Writer.destroy({
      where: { idwriter: id }
    }).then(() => {
      return res.redirect('listEscritor')
    })
  }catch(err) {
    res.status(400).send('Erro em excluir os dados do Escritor')
  }
}

module.exports = { createWriter, listAllWriter, listWriter, updateWriter, deleteWriter  }