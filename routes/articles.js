const express = require('express')
const router = express.Router()
const articleController = require('../controllers/articles')
const { verifyToken } = require('../middlewares/auth')

// READ ARTICLES
router.get('/', verifyToken, articleController.getAllArticles)
router.get('/:userId', verifyToken, articleController.getUserArticles)
// router.get('/:userId/articles')

// CREATE ARTICLE
router.post('/', verifyToken, articleController.createArticle)

// UPDATE ARTICLE
router.patch('/:id/like', verifyToken, articleController.likeArticle)     // upvote & downvote

// DELETE ARTICLE
router.delete('/:id', verifyToken, articleController.deleteArticle)


exports.router = router