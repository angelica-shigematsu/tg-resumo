let data = require('./Writer')
module.exports = {
  create(newVolunteer) {
    data.push(newVolunteer)
  },
  get() {
    return data
  },
  update(newVolunteer) {
    data = newVolunteer
  },
  delete(id) {
    data = data.filter(volunteer => Number(volunteer.id) != Number(id))
  }
}