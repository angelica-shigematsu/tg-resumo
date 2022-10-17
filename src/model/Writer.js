let data = [
  {
    id: 1,
    nameWriter: 'Clarice Lispector',
    dateBirthWriter: Date.now()
  },
  {
    id: 1,
    nameWriter: 'Joana',
    dateBirthWriter: Date.now()
  }
]
module.exports = {
  create(newWriter) {
    data.push(newWriter)
  },
  get() {
    return data
  },
  update(newWriter) {
    data = newWriter
  },
  delete(id) {
    data = data.filter(writer => Number(writer.id) != Number(id))
  }
}