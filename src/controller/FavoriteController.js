const Favorite = require('../model/Favorite');
const Volunteer = require('../model/User')
const { getSummary, getRating } = require('./RatingController');

async function createFavorite(req, res) {
  const { refUser, refSummary } = req.body

  created_at = new Date();

  try{

    const refUserComment = await getUserInformation(req, res);
    
    const summary = await getSummary(refSummary);

    const ratings = await getRating(refSummary);

    await Favorite.create({
      created_at,
      refSummary,
      refUser, 
    })

    res.render('rating', { 
      book: summary.book.title,   
      ratings: ratings,
      summary: summary,
      volunteer: summary.user.fullName, 
      writer: summary.writer.nameWriter, 
      messageFavorite: 'Adicionado como favorito com sucesso',
      refUserComment: refUserComment
    })
  }catch(err) {
    res.json('erro')
  }
}

async function getUserInformation(req, res) {
  if (req.isAuthenticated()) {
      const  { email } = req.user
      const profile = await Volunteer.findOne({
        where: { email: email}
    })
    return profile
  }
}

module.exports = { createFavorite }