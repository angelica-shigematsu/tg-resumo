const Writer = require('../model/Writer')

async function listVolunteers ( req, res){
  await Writer.findAll({raw: true, order})
}

module.exports = { listVolunteers }