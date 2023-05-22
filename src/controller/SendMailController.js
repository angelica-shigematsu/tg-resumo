const sendGridMail = require('@sendgrid/mail')
const User = require('../model/User')
const emailOng = require('../../config/fromMail')

async function sendMail(req, res) {
  const { email } = req.body
  const API_KEY = ''

  sendGridMail.setApiKey(API_KEY)

  if (await noExitsMail(email)) { return res.render("index", { error: "Não existe esse email cadastrado"}) }

  const message = {
    to: email,
    from: emailOng.email,
    subject:'ColabBook - Redefinição de senha',
    text: `Segue o link de redefinição de senha: http://localhost:8090/modificarsenha?email=${email} `
  }

  sendGridMail
    .send(message)
    .then(() => { return res.render("index", { error: "Redefinido a senha com sucesso. Verifique seu email!"})})
    .catch((error) => console.log("Error: " + error))
}

async function noExitsMail(email) {
 
  const profile = await User.findOne({
    where: { email: email}
  })

  if (profile) return false

  return true
}

async function getMail(req, res) {
  const { email } = req.query

  res.render("resetPassword", {
    email,
    message: false, 
    messageError: false 
  })
}

module.exports = {
  sendMail,
  getMail
}