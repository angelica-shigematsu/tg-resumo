const Favorite = require('../model/Favorite')

async function createFavorite(req, res) {
  const { refUser, refSummary} = req.body

  try{
    await Favorite.create({
      refSummary,
      refUser
    })

    res.redirect('/resumo/avaliacao/'+ `${refSummary}`)
  }catch(err) {
    res.json('erro')
  }
}

module.exports = { createFavorite }