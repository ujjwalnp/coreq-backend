const express = require('express')
const router = express.Router()
const feedController = require('../controllers/feed')
const articleController = require('../controllers/articles')
const projectController = require('../controllers/projects')
const { verifyToken } = require('../middlewares/auth')

router
    /* READ */
    // GET FEED
    .get('/getFeed', verifyToken, feedController.getFeed)
    // get recommended articles
    .get('/recommendedArticles', verifyToken, articleController.getRecommendArticles)
    // get recommended projects
    .get('/recommendedProjects', verifyToken, projectController.getRecommendProjects)

    // GET SUGGESTEDFRIENDS
    .get('/friendSuggestions/:userId', verifyToken, feedController.getFriendSuggestions)

exports.router = router