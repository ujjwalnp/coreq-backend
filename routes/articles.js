const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articles')
const { verifyToken } = require('../middlewares/auth')

router
/* READ ARTICLES */
    .get('/', verifyToken, articleController.getAllArticles)
    .get('/user/:userId', verifyToken, articleController.getUserArticles)
    .get('/:id', verifyToken, articleController.getSpecificArticle)
    .get('/user/:userId/countArticles', verifyToken, articleController.countUserArticles)
    .get('/:id/countUpVote', verifyToken, articleController.getUpVoteCount)
    .get('/:id/countDownVote', verifyToken, articleController.getDownVoteCount)
    .get('/:id/countComments', verifyToken, articleController.countComments)

/* CREATE ARTICLE */
    .post('/', verifyToken, articleController.createArticle)

/* UPDATE ARTICLE */
    // UpVote
    .post('/:id/upVote', verifyToken, articleController.upVoteArticle)
    // DownVote
    .post('/:id/downVote', verifyToken, articleController.downVoteArticle)
    // Comment
    .post('/:id/comment', verifyToken, articleController.commentArticle)

/* DELETE ARTICLE */
    .delete('/user/:userId', verifyToken, articleController.deleteArticle)
    .delete('/:id/deleteComment', verifyToken, articleController.deleteComment)

exports.router = router