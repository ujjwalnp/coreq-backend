const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articles')
const { verifyToken } = require('../middlewares/auth')

router
/* READ ARTICLES */
.get('/', verifyToken, articleController.getAllArticles)
.get('/:userId', verifyToken, articleController.getUserArticles)
// router.get('/:userId/articles')

/* CREATE ARTICLE */
.post('/', verifyToken, articleController.createArticle)

/* UPDATE ARTICLE */
.patch('/:id/like', verifyToken, articleController.likeArticle)     // upvote & downvote

/* DELETE ARTICLE */
.delete('/:id', verifyToken, articleController.deleteArticle)


exports.router = router