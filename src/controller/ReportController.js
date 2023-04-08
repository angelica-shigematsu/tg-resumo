const Book = require('../model/Book');
const SummaryController = require('./SummaryController')
const Rating = require('../model/Rating')
const Report = require('../model/Report')
const Summary = require('../model/Summary')
const User = require('../model/User')
const MeasureReport = require('../model/MeasureReport')

async function createReport(req, res) {
  try {
    const { refSummary, refUser, reason } = req.body
    const data = new Date()
    let status = 'Não Avaliado'
    
    await Report.create({
      status,
      reason,
      data,
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

async function updateReport(req, res) {
  const { status, observation } = req.body
  let { refReport } = req.body

  try{
    const refUserViewSummary = await getUserInformation(req, res);
    const id = refUserViewSummary.id
    const data = new Date()

    await MeasureReport.create({
      status,
      observation,
      data,
      refUserViewSummary: id,
      refReport
    })

    await Report.update({
      status
    },{
      where: {
        id: refReport
      }
    })

    res.redirect('/denuncia');
  }catch(error) {
    res.json(error.message)
  }
  
}

async function getAllReportByUser(req, res) {
  const profile = await getUserInformation(req, res);
  try{
    let menu = await getlevelUser(profile)
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    const reports = await Report.findAll({
      where: {
        refUser: profile.id
      },
      raw: true,
      nest: true
    })

    res.render('listAllReportToUser', { 
      reports: reports,
      fullName: profile.fullName,
      email: profile.email,
      message: false,
      menu: menu,
      admin: admin, 
      volunteer: volunteer
    })

  }catch(err){
    res.json(err)
  } 
}

async function getInformationReport(req, res) {

  try{
    let profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile)
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)

    const reports = await Report.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })

    res.render('listAllReport', {
      reports: reports,
      menu: menu,
      admin: admin,
      volunteer: volunteer
    })
  }catch(error) {
    res.json(error.message)
  }
}

async function getReport(req, res) {
  const { id } = req.params

  try{
    Summary.belongsTo(User,{
      foreignKey: 'id'
    })

    Summary.belongsTo(Book,{
      foreignKey: 'id'
    })
    
    Report.belongsTo(Summary, {
      foreignKey: 'id'
    })

    const report = await Report.findOne({
      where: { id: id }
    })

    const summary = await Summary.findOne({ 
      where: { id: report.refSummary },
      include: [{
        association: 'book',
        key: 'id'
      }],
      nested: true
    })
    console.log(report.status)
    res.render('listReport', { report: report, status: report.status, summary: summary})
  }catch(err) {
    res.json("")
  }
}

async function deleteReport(req, res) {
  const { id, userId } = req.body

  try{
    await Report.destroy({
      where: { id: id }
    })

    const reports = await Report.findAll({
      include: [{
        association: 'user',
        attributes: ['fullName','email', 'id', 'createdAt'],
      }],
      where: {
        refUser: userId
      },
      raw: true,
      nest: true
    })
   
    res.render('listAllReportToUser', { reports: reports, message: 'Excluído com sucesso'})

  }catch(err) {
    res.json()
  }
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

module.exports = { 
  createReport, 
  getInformationReport, 
  getAllReportByUser, 
  updateReport,
  getReport,
  deleteReport
}