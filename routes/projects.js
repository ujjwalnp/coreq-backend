const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projects')
const { verifyToken } = require('../middlewares/auth')

router
// READ PROJECTS
.get('/', verifyToken, projectController.getAllProjects)
.get('/user/:userId', verifyToken, projectController.getUserProjects)
// router.get('/:userId/projects')
.get('/user/:userId/countProjects', verifyToken, projectController.countUserProjects)
.get('/:id/countUpVote', verifyToken, projectController.getUpVoteCount)
.get('/:id/countDownVote', verifyToken, projectController.getDownVoteCount)

// GET specific archive
.get('/:projectId', verifyToken, projectController.getSpecificProject)

// CREATE PROJECT
.post('/', verifyToken, projectController.createProject)

/* UPDATE PROJECT */
// UpVote
.post('/:id/upVote', verifyToken, projectController.upVoteProject)
// DownVote
.post('/:id/downVote', verifyToken, projectController.downVoteProject)

// DELETE PROJECT
.delete('/user/:userId', verifyToken, projectController.deleteProject)


exports.router = router