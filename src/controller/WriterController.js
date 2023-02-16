const Writer = require('../model/Writer')

async function createWriter(req, res) {
  const { nameWriter } = req.body
  const { dateBirthWriter } = req.body

  try{
    const writers = await showAllWriters()
    await Writer.create({
    nameWriter,
    dateBirthWriter
  }).then(() => res.render("listAllWriters", { writers: writers, message: 'Criado com sucesso', messageError: false}))
  }catch(error){
    res.json(error)
  }
}

async function listAllWriter(req, res) {
  const writers = await showAllWriters()
    res.render("listAllWriters", {
        writers: writers,
        message: false, 
        messageError: false
  })
} 

async function showAllWriters() {
  const writers = await Writer.findAll({ raw : true, order: [
    ['nameWriter', 'ASC']//ordem decrescente
  ]})
  return writers

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
    const writers = await showAllWriters()
    await Writer.update({
      nameWriter,
      dateBirthWriter
    },{
      where: {
        idWriter: id
    }}).then(() => {
      res.render('listAllWriters', {  writers: writers, message: 'Alterado com sucesso', messageError: false})
    })
  }catch(err) {
    res.status(400).send('Erro em atualizar os dados do Escritor')
  }
}

async function deleteWriter( req, res) {
  const { id } = req.body

  try{
    const writers = await showAllWriters()
    await Writer.destroy({
      where: { idWriter: id }
    }).then(() => {
      return res.render("listAllWriters", {  writers: writers, message: 'Excluído com sucesso', messageError: false } )
    })
  }catch(err) {
    res.status(400).send('Não pode excluir dados do escritor! Tem dependência de livro cadastrado!')
  }
}

module.exports = { 
  createWriter, 
  listAllWriter, 
  listWriter, 
  showAllWriters,
  updateWriter, 
  deleteWriter  
}