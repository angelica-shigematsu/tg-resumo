const Writer = require('../database/Writer')

async function listVolunteers ( req, res){
  await Writer.findAll({raw: true, order})

  return writers
}

module.exports = { listVolunteers }