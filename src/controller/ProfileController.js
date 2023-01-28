const Profile = require('../model/User')

async function listProfile(req, res) {
  const { id } = req.params

  try{
    const profile = await Profile.findOne({
      where: { id: id }}
    );
    res.render('profile', { profile: profile });
  }catch(error) {
    throw new Error(error)
  }
}  

async function getUserInformation(req, res) {
  if (req.isAuthenticated()) {
      const  { email } = req.user
      const profile = await Profile.findOne({
      where: { email: email }
    })
    return profile
  }
}

async function showUserPage(req, res) {
  const profile = await getUserInformation(req, res)
  res.render('profile', { profile: profile })
}



module.exports = { listProfile, getUserInformation, showUserPage};