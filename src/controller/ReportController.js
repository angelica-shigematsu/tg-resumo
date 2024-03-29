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
    const profile = await getUserInformation(req, res)
    let menu = await getlevelUser(profile)
    let admin = await getlevelAdmin(profile)
    let volunteer = await getlevelVolunteer(profile)
    const data = new Date()
    let status = 'Não Avaliado'

    const summaries = await SummaryController.listAllSummary();

    const ratings = await Rating.findAll({
      raw: true
    })

    await Report.create({
      status,
      reason,
      data,
      refSummary,
      refUser
    })

    res.render('listAllSummary', {
      summaries: summaries, 
      ratings: ratings, 
      profile: profile,
      menu,
      admin,
      volunteer,
      message: false,
      messageError: false, 
      messageReport: 'Denunciado com sucesso'
    })

  } catch (error) {
    res.json(error)
  }
}

async function listFormsToReport(req, res) {
  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  const { id } = req.params

  res.render('report', {
    summaryId: id,
    profile: profile,
    menu,
    admin,
    volunteer
  })
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

async function updateReportToUser(req, res) {
  const { id } = req.params
  const { reason } = req.body

  try{
    await Report.update({
      reason
    },{
      where: {
        id: id
      }
    })

    res.redirect('/denuncia/usuario');
  }catch(error) {
    res.json(error.message)
  } 
}

async function getAllReportByUser(req, res) {
  try{
    const profile = await getUserInformation(req, res);
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
      profile,
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
      where: { status: 'Não Avaliado'}, 
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })

    res.render('listAllReport', {
      reports: reports,
      profile,
      menu: menu,
      admin: admin,
      volunteer: volunteer
    })
  }catch(error) {
    res.json(error.message)
  }
}

async function deleteSummary(req, res) {
  const { id } = req.body

  try{
    await Report.destroy({
      where: { id: id }
    })
    
    res.redirect("/denuncia/usuario")

  }catch(error) {
    res.redirect("/denuncia/usuario")
  }
}


async function getReport(req, res) {
  const { id } = req.params

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  try{
    Summary.belongsTo(User,{
      foreignKey: 'refUser'
    })

    Summary.belongsTo(Book,{
      foreignKey: 'refBook'
    })
    
    Report.belongsTo(Summary, {
      foreignKey: 'refSummary'
    })

    const report = await Report.findOne({
      where: { id: id }
    })

    const summary = await Summary.findOne({ 
      where: { id: report.refSummary },
      include: [{
        association: 'book',
        key: 'refBook'
      }],
      nested: true
    })

    res.render('listReport', { 
      report: report, 
      status: report.status, 
      summary: summary,
      profile,
      menu: menu,
      admin: admin,
      volunteer: volunteer
    })
  }catch(err) {
    res.json("")
  }
}

async function getReportToUser(req, res) {
  const { id } = req.params

  let profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile)
  let admin = await getlevelAdmin(profile)
  let volunteer = await getlevelVolunteer(profile)

  try{
    Summary.belongsTo(User,{
      foreignKey: 'refUser'
    })

    Summary.belongsTo(Book,{
      foreignKey: 'refBook'
    })
    
    Report.belongsTo(Summary, {
      foreignKey: 'refSummary'
    })

    const report = await Report.findOne({
      where: { id: id }
    })

    const summary = await Summary.findOne({ 
      where: { id: report.refSummary },
      include: [{
        association: 'book',
        key: 'refBook'
      }],
      nested: true
    })

    res.render('listReportToUser', { 
      report: report, 
      status: report.status, 
      summary: summary,
      profile,
      menu: menu,
      admin: admin,
      volunteer: volunteer
    })
  }catch(err) {
    res.json("")
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
  createReport, 
  getInformationReport, 
  getAllReportByUser,
  updateReportToUser,
  listFormsToReport, 
  updateReport,
  getReport,
  getReportToUser,
  deleteSummary
}