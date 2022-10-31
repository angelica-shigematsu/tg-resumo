const localStrategy = require("passport-local").Strategy
const User = require('../src/model/Volunteer')

module.exports = async function(passport){

    await passport.use(new localStrategy({usernameField: 'email', passwordField: "password"}, (email, password, done) => {
      User.findOne({where: {email: email}}).then((user) => {
      if(!user){
        return done(null, false, {message: "Está conta não existe"})
      }
      
      if(password !== user.password){
        return done(null, false, {message: "Senha incorreta"})
      }
      return done(null, user)
    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.idVolunteer)
  })

  passport.deserializeUser((idVolunteer, done) => {
    User.findByPk(idVolunteer, (err, user) => {
      done(err, user)
    })
  })
}