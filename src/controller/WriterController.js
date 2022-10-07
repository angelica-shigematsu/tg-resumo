const Writer = require('../database/Writer')

async function createWriter(req, res) {
  const { fullName } = req.body
  const { dateBirthWriter } = req.body

    await Writer.create({
    fullName,
    dateBirthWriter
  }).then(() => res.redirect('/'))
}

async function listWriter(req, res) {
  const { writerId } = req.params
    const writers = Writer.get()

    const writer = writers.find(writer => Number(writer.writerId) === Number(writerId))

    if(!writer) return res.send('Escritor não encontrado')

    return res.render(index, { writer })
  } 

async function updateWriter(req, res) {
  const { writerId } = req.parms
  const writers = Writer.get()
  const write = writers.find(writer => Number(writer.WriterId) === Number(writerId))

  if (!write) return response.send('Cadastro não encontrado')

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

module.exports = { createWriter, listWriter, updateWriter, deleteWriter  }