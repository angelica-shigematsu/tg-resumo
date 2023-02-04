const Report = require('../model/Report')
const SummaryController = require('./SummaryController')
const Rating = require('../model/Rating')

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

module.exports = { createReport }