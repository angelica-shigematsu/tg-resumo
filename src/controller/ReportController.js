const Report = require('../model/Report')
const SummaryController = require('./SummaryController')
const Rating = require('../model/Rating')
const User = require('../model/User')

async function createReport(req, res) {
  try {
    const { refSummary, refUser } = req.body

    await Report.create({
      refSummary,
      refUser
    }).then(async() => {
      const summaries = await SummaryController.listAllSummary();

      const ratings = await Rating.findAll({
        raw: true
      })

      res.render('listAllSummary', {
        summaries: summaries, 
        ratings: ratings, 
        messageError: false, 
        messageReport: 'Denunciado com sucesso'
      })
    })
  } catch (error) {
    res.json(error)
  }
}

async function getInformationReport(req, res) {
console.log('hit')
  Report.belongsTo(User, {
    foreignKey: 'id'
  })

  const reports = await Report.findAll({
    order: [['createdAt', 'DESC']],
    include: [{
      association: 'user',
      attributes: ['fullName','email', 'id'],
    }],
    raw: true,
    nest: true
  })
  res.render('listAllReport', {
    reports: reports
  })
}


module.exports = { createReport, getInformationReport }