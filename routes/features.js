const express = require('express')
const router = express.Router()
const featureController = require('../controllers/features')
const { verifyToken } = require('../middlewares/auth')

router
/* CREATE */
/* READ */

/* UPDATE */
    // UpVote
    .patch('/:id/upVote', verifyToken, featureController.upVotePost)
    // DownVote
    .patch('/:id/downVote', verifyToken, featureController.downVotePost)
    // Comment
    // .post('/:id/comment', verifyToken, featureController.commentArchive)

/* DELETE */
    .delete('/:id/deletePost', verifyToken, featureController.deletePost)

exports.router = router