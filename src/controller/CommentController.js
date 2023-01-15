const Book = require('../model/Book')
const Comment = require('../model/Comment')
const Volunteer = require('../model/User')
const Writer = require('../model/Writer')

async function createComment(req, res) {
  const { commentContent } = req.body

  const status = 'enviado'

  await Comment.create({
    commentContent,
    status,
    refSummary
  }).then(() => {
    res.json({ sucess: true })
  })
}

async function listCommentById() {
  const { id } = req.params
  
    Comment.belongsTo(Book, {
      foreignKey: {
        name: 'id'
      }});  

  await Comment.findOne({
    include: [{
      association: 'book',
      attributes: ['title']
    }],
   where: { id : id }
  }).then(comment => {
    res.json(comment)
  })
}

async function listCommentBySummary() {
  const { id } = req.params

  await Comment.findOne({
    where: { refSummary : id }
  }).then(comment => {
    res.json(comment)
  })
}

async function updateComment(req, res) {
  const { id } = req.params
  const { commentContent, status, createdAt } = req.body

  try{
    await Comment.update({
      commentContent,
      status,
      createdAt,
      refSummary
    },{
      where: {
        id: id
      }
    }).then((comment) => {
      res.json() 
    })

  }catch(err) {
    res.json(err)
  }
}

async function deleteComment(req, res) {
  const { id } = req.body

  try{
    await Comment.destroy({
      where: { id: id }
    }).then(() => {
      res.json()
    })
  }catch(err) {
    res.json()
  }
}

module.exports = { createComment, listCommentById }