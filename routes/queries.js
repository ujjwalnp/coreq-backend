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
    .get('/:id/countUpVote', verifyToken, queryController.getUpVoteCount)
    .get('/:id/countDownVote', verifyToken, queryController.getDownVoteCount)

/* CREATE QUERY */
    .post('/', verifyToken, queryController.createQuery)

/* UPDATE QUERY */
    // UpVote
    .post('/:id/upVote', verifyToken, queryController.upVoteQuery)
    // DownVote
    .post('/:id/downVote', verifyToken, queryController.downVoteQuery)
    // Comment
    .post('/:id/comment', verifyToken, queryController.commentQuery)

/* DELETE QUERY */
    .delete('/user/:userId', verifyToken, queryController.deleteQuery)
    .delete('/:id/deleteComment', verifyToken, queryController.deleteComment)

exports.router = router