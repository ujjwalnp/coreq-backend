const express = require('express')
const router = express.Router()
const archiveController = require('../controllers/archives')
const { verifyToken } = require('../middlewares/auth')

router
/* READ ARCHIVES */
    .get('/', verifyToken, archiveController.getAllArchives)
    .get('/user/:userId', verifyToken, archiveController.getUserArchives)
    // router.get('/:userId/archives')
    .get('/user/:userId/countArchives', verifyToken, archiveController.countUserArchives)
    .get('/:id/countUpVote', verifyToken, archiveController.getUpVoteCount)
    .get('/:id/countDownVote', verifyToken, archiveController.getDownVoteCount)

    // GET specific archive
    .get('/:archiveId', verifyToken, archiveController.getSpecificArchive)

/* CREATE ARCHIVE */
    .post('/', verifyToken, archiveController.createArchive)

/* UPDATE ARCHIVE */
    // UpVote
    .post('/:id/upVote', verifyToken, archiveController.upVoteArchive)
    // DownVote
    .post('/:id/downVote', verifyToken, archiveController.downVoteArchive)

// DELETE ARCHIVE
    .delete('/user/:userId', verifyToken, archiveController.deleteArchive)


exports.router = router