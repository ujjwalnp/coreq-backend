const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articles')
const { verifyToken } = require('../middlewares/auth')

router
/* READ ARTICLES */
.get('/', verifyToken, articleController.getAllArticles)
.get('/user/:userId', verifyToken, articleController.getUserArticles)
// router.get('/:userId/articles')
.get('/user/:userId/countArticles', verifyToken, articleController.countUserArticles)
.get('/:id/countUpVote', verifyToken, articleController.getUpVoteCount)
.get('/:id/countDownVote', verifyToken, articleController.getDownVoteCount)

// GET specific article
.get('/:articleId', verifyToken, articleController.getSpecificArticle)

/* CREATE ARTICLE */
.post('/', verifyToken, articleController.createArticle)

/* UPDATE ARTICLE */
// UpVote
.post('/:id/upVote', verifyToken, articleController.upVoteArticle)
// DownVote
.post('/:id/downVote', verifyToken, articleController.downVoteArticle)

/* DELETE ARTICLE */
.delete('/user/:userId', verifyToken, articleController.deleteArticle)


exports.router = router