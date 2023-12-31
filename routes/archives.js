const express = require('express')
const router = express.Router()
const archiveController = require('../controllers/archives')
const { verifyToken } = require('../middlewares/auth')
const { archivePDFUpload } = require('../middlewares/fileUpload')

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
    .post('/', verifyToken, archivePDFUpload.single('archivePdf'), archiveController.createArchive)

/* UPDATE ARCHIVE */
    // Comment
    .post('/:id/comment', verifyToken, archiveController.commentArchive)

/* DELETE ARCHIVE */
    .delete('/:id/deleteComment', verifyToken, archiveController.deleteComment)

exports.router = router