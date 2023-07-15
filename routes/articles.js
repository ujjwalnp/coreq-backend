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

// GET specific article
.get('/:articleId', verifyToken, articleController.getSpecificArticle)

/* CREATE ARTICLE */
.post('/', verifyToken, articleController.createArticle)

/* UPDATE ARTICLE */
.patch('/:id/like', verifyToken, articleController.likeArticle)     // upvote & downvote

/* DELETE ARTICLE */
.delete('/user/:userId', verifyToken, articleController.deleteArticle)


exports.router = router