const Book = require('../model/Book');
const SummaryController = require('./SummaryController')
const Rating = require('../model/Rating')
const Report = require('../model/Report')
const Summary = require('../model/Summary')
const User = require('../model/User')

async function createReport(req, res) {
  try {
    const { refSummary, refUser } = req.body
    let active = true
    await Report.create({
      active,
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

async function getAllReportByUser(req, res) {
  const { id } = req.params

  Report.belongsTo(User, {
    foreignKey: 'id'
  })

  try{
    const reports = await Report.findAll({
      include: [{
        association: 'user',
        attributes: ['fullName','email', 'id'],
      }],
      where: {
        refUser: id
      },
      raw: true,
      nest: true
    })

    res.render('listAllReportToUser', { 
      reports: reports,
    })

  }catch(err){
    res.json(err)
  } 
}

async function getReportByUser(req, res) {
  const { id } = req.params

  try{
    Report.belongsTo(Summary,{
      foreignKey: 'id'
    })

    Summary.belongsTo(Book,{
      foreignKey: 'id'
    })

    const report = await Report.findOne({
      where: { id: id },
      include: [{
        association: 'summaryBook',
        key: 'id'
      }]
    })

    const summary = await Summary.findOne({ 
      where: { id: report.refSummary },
      include: [{
        association: 'book',
        key: 'id'
      }] 
    })

    res.render('listReport', { 
      report: report,
      summary: summary
    })

  }catch(err){
    res.json(err)
  } 
}

async function getInformationReport(req, res) {
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


module.exports = { createReport, getInformationReport, getAllReportByUser, getReportByUser }