const Writer = require('../model/Writer')

async function getForeignKey(req, res){
  await Writer.findAll({ raw : true, order: [
    ['nameWriter', 'ASC']//ordem decrescente
  ]}).then(writers => {
    res.render("book", {
        writers: writers
    })
  })
}

module.exports = { getForeignKey }