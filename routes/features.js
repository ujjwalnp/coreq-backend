const express = require('express')
const router = express.Router()
const featureController = require('../controllers/features')
const { verifyToken } = require('../middlewares/auth')

router
/* READ ARCHIVES */

/* CREATE ARCHIVE */

/* UPDATE ARCHIVE */
    // UpVote
    .patch('/:id/upVote', verifyToken, featureController.upVotePost)
    // DownVote
    .patch('/:id/downVote', verifyToken, featureController.downVotePost)
    // Comment
    // .post('/:id/comment', verifyToken, featureController.commentArchive)

/* DELETE ARCHIVE */


exports.router = router