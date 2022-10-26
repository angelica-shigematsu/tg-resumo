const Profile = require('../model/Volunteer')
const date = require('../utils/DateFormat')

async function listProfile(req, res) {
  const { id } = req.params
  try{
    const volunteer = await Profile.findOne({
      where: { idVolunteer: id }
    });

    res.render('profile', { volunteer: volunteer })
    
  }catch(error){
    throw new Error(error);
  }
} 

module.exports = { listProfile };