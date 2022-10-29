const Volunteer = require('../model/Volunteer')

async function createVolunteer(req, res) {
  const { fullName } = req.body
  const { userName } = req.body
  const { cpf } = req.body
  const { dateBirthUser } = req.body
  const { email } = req.body
  const { password } = req.body

  try{
    await Volunteer.create({
      fullName,
      userName,
      cpf,
      dateBirthUser,
      email,
      password
    }).then(() => res.redirect(('listVolunteer')));

  }catch(error) {
    throw new Error(error)
  }
}

async function listVolunteer(req, res) {
  const volunteers = await Volunteer.findAll({raw: true, order: [
    ['fullName', 'ASC']
  ]});

    res.render("listVolunteer", {
      volunteers: volunteers
    });
    
};

async function updateVolunteer(req, res) {
  const { id } = req.parms
  
  try{
    const volunteer = await Volunteer.findOne({
      where: { idVolunteer: id }
    });
    
    const updateWriter = {
      ...volunteer
    }

    await Volunteer.update(updateWriter)

    res.redirect('/voluntario/')
    
  }catch(error){
    throw new Error(error);
  }
}


module.exports = { createVolunteer, listVolunteer, updateVolunteer }