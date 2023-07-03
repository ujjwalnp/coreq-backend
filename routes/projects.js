const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projects')
const { verifyToken } = require('../middlewares/auth')

// READ PROJECTS
router.get('/', verifyToken, projectController.getAllProjects)
router.get('/:userId', verifyToken, projectController.getUserProjects)
// router.get('/:userId/projects')

// CREATE PROJECT
router.post('/', verifyToken, projectController.createProject)

// UPDATE PROJECT
// router.patch('/:id/like', verifyToken, projectController.likeArticle)     // upvote & downvote

// DELETE PROJECT
router.delete('/:id', verifyToken, projectController.deleteProject)


exports.router = router