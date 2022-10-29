const Profile = require('../model/Volunteer')

async function listProfile(req, res) {
  const { id } = req.params

  try{
    const profile =await Profile.findOne({
      where: { idVolunteer: id }}
    );

    res.render('profile', { profile: profile });
    
  }catch(error) {
    throw new Error(error)
  }
}   

module.exports = { listProfile };