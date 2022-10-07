const Writer = require('../database/Writer')

async function show ( req, res){
  const writers = Writer.get()

  return writers
}

module.exports = writers