const Writer = require('../database/Writer')

async function listVolunteers ( req, res){
  const writers = Writer.data

  return writers
}

module.exports = { listVolunteers }