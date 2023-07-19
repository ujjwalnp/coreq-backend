const express = require('express')
const router = express.Router()
const archiveController = require('../controllers/archives')
const { verifyToken } = require('../middlewares/auth')

router
/* READ ARCHIVES */
    .get('/', verifyToken, archiveController.getAllArchives)
    .get('/user/:userId', verifyToken, archiveController.getUserArchives)
    .get('/:id', verifyToken, archiveController.getSpecificArchive)
    .get('/user/:userId/countArchives', verifyToken, archiveController.countUserArchives)
    .get('/:id/countUpVote', verifyToken, archiveController.countUpVotes)
    .get('/:id/countDownVote', verifyToken, archiveController.countDownVotes)
    .get('/:id/countComment', verifyToken, archiveController.countComments)

/* CREATE ARCHIVE */
    .post('/', verifyToken, archiveController.createArchive)

/* UPDATE ARCHIVE */
    // UpVote
    .post('/:id/upVote', verifyToken, archiveController.upVoteArchive)
    // DownVote
    .post('/:id/downVote', verifyToken, archiveController.downVoteArchive)
    // Comment
    .post('/:id/comment', verifyToken, archiveController.commentArchive)

/* DELETE ARCHIVE */
    .delete('/user/:userId', verifyToken, archiveController.deleteArchive)
    .delete('/:id/deleteComment', verifyToken, archiveController.deleteComment)

exports.router = router