const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projects')
const { verifyToken } = require('../middlewares/auth')

router
/* READ PROJECTS */
    .get('/', verifyToken, projectController.getAllProjects)
    .get('/user/:userId', verifyToken, projectController.getUserProjects)
    .get('/:id', verifyToken, projectController.getSpecificProject)
    .get('/user/:userId/countProjects', verifyToken, projectController.countUserProjects)
    .get('/:id/countUpVote', verifyToken, projectController.countUpVotes)
    .get('/:id/countDownVote', verifyToken, projectController.countDownVotes)
    .get('/:id/countComment', verifyToken, projectController.countComments)

/* CREATE PROJECT */
    .post('/', verifyToken, projectController.createProject)

/* UPDATE PROJECT */
    // UpVote
    .post('/:id/upVote', verifyToken, projectController.upVoteProject)
    // DownVote
    .post('/:id/downVote', verifyToken, projectController.downVoteProject)
    // Comment
    .post('/:id/comment', verifyToken, projectController.commentProject)

/* DELETE PROJECT */
    .delete('/user/:userId', verifyToken, projectController.deleteProject)
    .delete('/:id/deleteComment', verifyToken, projectController.deleteComment)


exports.router = router