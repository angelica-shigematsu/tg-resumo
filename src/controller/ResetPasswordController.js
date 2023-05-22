const User = require('../model/User')

async function resetPassword (req, res) {
  const { email, newPassword, repeatPassword } = req.body

  if (newPassword != repeatPassword) res.render("resetPassword", { message: false, messageError: 'As senhas estão incompatíveis'})

  const user = await User.findOne({
    where: {
      email: email
    }
  })
  
  if (!user) res.render("resetPassword", {
    message: false,
    messageError: "Não existe esse email cadastrado"
  })

  await User.update({
    password: newPassword
  }, {
    where: {
      email: email
    }
  }).then(() => {
    res.render("index", {
      error: "Senha modificada",
    })
  })
}

module.exports = {
  resetPassword
}