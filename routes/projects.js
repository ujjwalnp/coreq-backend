const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projects')
const { verifyToken } = require('../middlewares/auth')

// READ PROJECTS
router.get('/', verifyToken, projectController.getAllProjects)
router.get('/user/:userId', verifyToken, projectController.getUserProjects)
// router.get('/:userId/projects')
.get('/user/:userId/countProjects', verifyToken, projectController.countUserProjects)

// GET specific archive
.get('/:projectId', verifyToken, projectController.getSpecificProject)

// CREATE PROJECT
router.post('/', verifyToken, projectController.createProject)

// UPDATE PROJECT
// router.patch('/:id/like', verifyToken, projectController.likeArticle)     // upvote & downvote

// DELETE PROJECT
router.delete('/user/:userId', verifyToken, projectController.deleteProject)


exports.router = router