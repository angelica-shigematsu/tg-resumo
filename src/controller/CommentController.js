const Book = require('../model/Book')
const Comment = require('../model/Comment')
const Summary = require('../model/Summary')
const Volunteer = require('../model/User')
const Writer = require('../model/Writer')
const { listAllSummary } = require('./SummaryController')

async function listAllSummaryToUser(req, res) {
  const summaries = await listAllSummary()

  res.render('listAllSummaryToUser', { summaries: summaries })
}

async function searchDetailsSummary(req, res) {
  const { refSummary, refBook } = req.body

  Summary.belongsTo(Book, {
    foreignKey: {
        name: 'id'
    }
  })  
  Book.belongsTo(Writer, {
    foreignKey: {
        name: 'id'
    }
  })  

  Summary.belongsTo(Volunteer, {
    foreignKey: {
        name: 'id'
    }
  })

  const summary = await Summary.findOne({
    attributes: ['body', 'id'],
    include: [{
      association: 'user',
      attributes: ['fullName', 'id']
    }],
   where: { id : refSummary }
  })
  
  const nameWriter = await Book.findOne({
    include: [{
      association: 'writer',
      attributes: ['nameWriter']
    }],
   where: { id : refBook }
  })

  const commentsBySummary = await Comment.findAll({
    raw: true,
    order: [['commentContent', 'DESC']],
    where: {
      refSummary: refSummary
    }
  })

  const book = await Book.findOne({
    attributes: ['title'],
    where: { id : refBook }
  })

  await res.render('registerComment', {
    book: book,  
    commentsBySummary: commentsBySummary,
    nameWriter: nameWriter, 
    summary: summary, 
  })
}

async function createComment(req, res) {
  const { commentContent, refSummary, refVolunteer } = req.body

  let status = 'enviado'
  try {
    await Comment.create({
      commentContent,
      status,
      refSummary,
      refVolunteer
    }).then(() => {
      res.json({success: true})
      // res.render('registerComment', {})
    })
  }catch(error) {
    res.json(error)
  }
}

async function listCommentById() {
  const { id } = req.params
 
  Comment.belongsTo(Summary, {
    foreignKey: {
      name: 'id'
    }});  

  const comment = await Comment.findOne({
    include: [{
      association: 'sumaryBooks',
      attributes: ['summary']
    }],
   where: { id : id }
  })

 res.json()
}

async function listCommentBySummary() {
  const { id } = req.params

  await Comment.findOne({
    where: { refSummary : id }
  }).then(comment => {
    res.json()
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

module.exports = { 
  createComment,
  listAllSummaryToUser,
  searchDetailsSummary
}