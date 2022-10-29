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
    res.render("listWriters",{
        writers: writers
    });
});
} 

async function listWriter(req, res) {
  const { id } = req.params

  try{
    const writer = await Writer.findOne({
      where: { idWriter: id }
    });

    res.render('listWriter', { writer: writer })
    
  }catch(error){
    throw new Error(error);
  }
} 

async function updateWriter(req, res) {
  const { writerId } = req.parms
  const writers = Writer.get()
  const writer = writers.find(writer => Number(writer.WriterId) === Number(writerId))

  if (!writer) return response.send('Cadastro não encontrado')

  const updateWriter = {
    ...writer,
    nameWriter: req.body.nameWriter,
    dateBirthWriter: req.body.dateBirthWriter
  }

  const newWriter = writers.map(job => {
    if (Number(Writer.writerId) == Number(writerId)) {
      writer = updateWriter
    }
    return writer
  })

  await Writer.update(newWriter)
  res.redirect('/autor/' + writerId)
}

async function deleteWriter( req, res) {
  const { writerId } = req.params

  await Writer.delete(writerId)

  return res.redirect('/')
}

module.exports = { createWriter, listAllWriter, listWriter, updateWriter, deleteWriter  }