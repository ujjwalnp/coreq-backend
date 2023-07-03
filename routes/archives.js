const express = require('express')
const router = express.Router()
const archiveController = require('../controllers/archives')
const { verifyToken } = require('../middlewares/auth')

// READ ARCHIVES
router.get('/', verifyToken, archiveController.getAllArchives)
router.get('/:userId', verifyToken, archiveController.getUserArchives)
// router.get('/:userId/archives')

// CREATE ARCHIVE
router.post('/', verifyToken, archiveController.createArchive)

// UPDATE ARCHIVE
// router.patch('/:id/like', verifyToken, archiveController.likeArchive)     // upvote & downvote

// DELETE ARCHIVE
router.delete('/:id', verifyToken, archiveController.deleteArchive)


exports.router = router