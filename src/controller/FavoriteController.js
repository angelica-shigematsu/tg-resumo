const Favorite = require('../model/Favorite');
const Volunteer = require('../model/User')
const { getSummary, getRating } = require('./RatingController');

async function createFavorite(req, res) {
  const { refUser, refSummary } = req.body

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)
  let created_at = new Date();

  try{

    const refUserComment = await getUserInformation(req, res);
    
    const summary = await getSummary(refSummary);

    const ratings = await getRating(refSummary);

    const hasAddOnFavorite = await Favorite.findOne({
      where: { 
        refUser: profile.id,
        refSummary: refSummary
      }
    })
    
    if(hasAddOnFavorite) { 
      return res.render('rating', { 
        book: summary.book.title,   
        ratings: ratings,
        summary: summary,
        volunteer: summary.user.fullName, 
        writer: summary.writer.nameWriter, 
        messageFavorite: 'Já foi adiconado como favorito',
        refUserComment: refUserComment,
        profile,
        menu: menu, 
        admin: admin,
        volunteer: volunteer
    })
  }

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
      refUserComment: refUserComment,
      profile,
      menu: menu, 
      admin: admin,
      volunteer: volunteer
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

async function getlevelUser(profile) {
  if (profile.level == 'Usuario')
    return false
  else
    return true
}

async function getlevelVolunteer(profile) {
  if (profile.level == 'Voluntario')
    return true
  else
    return false
}

async function getlevelAdmin(profile) {
  if (profile.level == 'Administador')
    return true
  else
    return false
}


module.exports = { createFavorite }