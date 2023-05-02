const Sequelize = require('sequelize');
const Op = Sequelize.Op
const Book = require('../model/Book')
const Rating = require('../model/Rating')
const Summary = require('../model/Summary')
const Volunteer = require('../model/User')
const Writer = require('../model/Writer')

async function searchSummary(req, res) {
  const { fieldSearch } = req.body
  let summaries = []

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  try {
    if (!fieldSearch) 
    return res.render('listAllSummary', {
      profile,
      menu,
      admin,
      volunteer,
      messageError: 'O campo está vazio!'
    })

    Summary.belongsTo(Volunteer, {
      foreignKey: {
        name: 'id'
      }})
  
      Summary.belongsTo(Writer, {
        foreignKey: {
          name: 'id'
        }})
  
      Summary.belongsTo(Book, {
        foreignKey: {
          name: 'id'
        }});  

      const book = await Book.findOne({
        attributes: ['id', 'title'],
        where: { 
          title: { [Op.like]: `%${fieldSearch}%` }
        }
      })

      // let writer = await Writer.findOne({
      //   where: { nameWriter: { [Op.like]: `%${fieldSearch}%`}},
      //   attributes: ['id'],
      // })

      summaries = await Summary.findAll({
        where: {
          id: book.id,
          status: "Aprovado"
        },
          include: [{
          association: 'writer',
          attributes: ['nameWriter'],
        },{
          association: 'book',
          attributes: ['title'],
        },{
          association: 'user',
          attributes: ['id']
        }]   
      })

      if (!summaries[0].id) return res.render('listAllSummary', { 
        profile,
        menu,
        admin,
        volunteer,
        messageError: `Não existe resumo com o título ${fieldSearch}`, 
        messageReport: false })

    console.log(summaries[0])
    let ratings = await Rating.findAll({
      raw: true
    })

    res.render('listAllSummary', { 
      summaries: summaries, 
      ratings, 
      profile: profile,
      menu,
      admin,
      volunteer,
      messageError: false, 
      messageReport: false })
 }catch(error) {
  res.render('listAllSummary', {
    profile: profile,
    menu,
    admin,
    volunteer,
    messageError: `Não existe: ${fieldSearch}`})
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

module.exports = { searchSummary }