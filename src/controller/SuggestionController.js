const Book = require('../model/Book')
const Rating = require('../model/Rating')
const Suggestion = require('../model/Suggestion')
const Summary = require('../model/Summary')
const User = require('../model/User')
const Writer = require('../model/Writer')

async function createSuggestion(req, res) {
  const { observation, refSummary, refUser } = req.body
  
  const date = new Date()

  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  const refUserComment = await getUserInformation(req, res);

  const summary = await getSummary(refSummary);

  const ratings = await getRating(refSummary);

  await Suggestion.create({
    date,
    observation,
    refSummary,
    refUser
  })

  res.render("rating", {
    book: summary.book.title,   
    ratings: ratings,
    summary: summary,
    volunteer: summary.user.fullName, 
    writer: summary.writer.nameWriter, 
    messageFavorite: "Sugestão realizado com sucesso",
    refUserComment: refUserComment,
    profile,
    menu: menu, 
    admin: admin,
    volunteer: volunteer
  })
}

async function getSummary(id) {

  Summary.belongsTo(User, {
    foreignKey: {
      name: 'refUser'
    }
  })
  
  Summary.belongsTo(Writer, {
    foreignKey: {
      name: 'refWriter'
    }
  })

  Summary.belongsTo(Book, {
    foreignKey: {
      name: 'refBook'
    }
  });  

  const summary = await Summary.findOne({
    where: { id: id },

    include: [{
      association: 'user',
      attributes: ['fullName', 'id'],
      key: 'refUser'
      },{
        association: 'writer',
        attributes: ['nameWriter'],
        key: 'refWriter'
      },{
        association: 'book',
        attributes: ['title'],
        key: 'refBook'
    }] 
  })

  return summary
}

async function getRating(id) {
  Rating.belongsTo(User, {
    foreignKey: {
      name: 'refUser'
    }
  })
  const ratings = await Rating.findAll({
    where: {
      refSummary: id
    },
    include: [{
      association: 'user',
      attributes: ['fullName'],
      key: 'refUser'
    }],
    nested: true
  })
  return ratings
}

async function getUserInformation(req, res) {
  if (req.isAuthenticated()) {
      const  { email } = req.user
      const profile = await User.findOne({
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

async function getlevelAdmin(profile) {
  if (profile.level == 'Administrador')
    return true
  else
    return false
}

async function getlevelVolunteer(profile) {
  if (profile.level == 'Voluntario')
    return true
  else
    return false
}

module.exports = { 
  createSuggestion
}