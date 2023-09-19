const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projects')
const { verifyToken } = require('../middlewares/auth')
const { projectPDFUpload } = require('../middlewares/fileUpload')

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
    .post('/', verifyToken, projectPDFUpload.single('projectPdf'), projectController.createProject)

/* UPDATE PROJECT */
    // Comment
    .post('/:id/comment', verifyToken, projectController.commentProject)

/* DELETE PROJECT */
    .delete('/user/:userId', verifyToken, projectController.deleteProject)
    .delete('/:id/deleteComment', verifyToken, projectController.deleteComment)


exports.router = router