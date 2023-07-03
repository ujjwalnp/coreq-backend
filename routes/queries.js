const express = require('express')
const router = express.Router()
const queryController = require('../controllers/queries')
const { verifyToken } = require('../middlewares/auth')

// READ QUERIES
router.get('/', verifyToken, queryController.getAllQueries)
router.get('/:userId', verifyToken, queryController.getUserQueries)
// router.get('/:userId/projects')

// CREATE QUERY
router.post('/', verifyToken, queryController.createQuery)

// UPDATE QUERY
// router.patch('/:id/like', verifyToken, queryController.likeQuery)     // upvote & downvote

// DELETE QUERY
router.delete('/:id', verifyToken, queryController.deleteQuery)


exports.router = router