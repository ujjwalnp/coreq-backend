const express = require('express')
const router = express.Router()
const queryController = require('../controllers/queries')
const { verifyToken } = require('../middlewares/auth')

router
/* READ QUERIES */
    .get('/', verifyToken, queryController.getAllQueries)
    .get('/user/:userId', verifyToken, queryController.getUserQueries)
    .get('/:id', verifyToken, queryController.getSpecificQuery)
    .get('/user/:userId/countQueries', verifyToken, queryController.countUserQueries)
    .get('/:id/countUpVote', verifyToken, queryController.countUpVotes)
    .get('/:id/countDownVote', verifyToken, queryController.countDownVotes)
    .get('/:id/countComment', verifyToken, queryController.countComments)

/* CREATE QUERY */
    .post('/', verifyToken, queryController.createQuery)

/* UPDATE QUERY */
    // Comment
    .post('/:id/comment', verifyToken, queryController.commentQuery)

/* DELETE QUERY */
    .delete('/:id/deleteComment', verifyToken, queryController.deleteComment)

exports.router = router