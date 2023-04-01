const Profile = require('../model/User')

async function listProfile(req, res) {
  const { id } = req.params

  try{
    let menu = getlevelUser(profile)
    let admin = getlevelAdmin(profile)

    const profile = await Profile.findOne({
      where: { id: id }}
    );
    res.render('profile', { profile: profile, menu: menu, admin: admin})
  }catch(error) {
    throw new Error(error)
  }
}  

async function getUserInformation(req, res) {
  if (req.isAuthenticated()) {
      const  { email } = req.user
      const profile = await Profile.findOne({
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

async function showUserPage(req, res) {
  const profile = await getUserInformation(req, res)
  let menu = await getlevelUser(profile);
  let admin = await getlevelAdmin(profile);
  
  res.render('profile', { user: profile, menu: menu, admin: admin })
}



module.exports = { listProfile, getUserInformation, showUserPage};