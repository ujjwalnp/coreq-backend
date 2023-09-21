const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const { verifyToken } = require('../middlewares/auth')
const { handleProfileAndCoverPics } = require('../middlewares/fileUpload')

router
/* GET USERDETAILS */
    .get('/get/:userId', verifyToken, userController.getUserDetails)
    .get('/get/:userId/savedPost', verifyToken, userController.getUserSavedPosts)
    .get('/get/:userId/followings', verifyToken, userController.getUserFollowings)
    .get('/get/:userId/followers', verifyToken, userController.getUserFollowers)

/* FOLLOW USER */
    .post('/follow/:userId', verifyToken, userController.followUser)
    /* UNFOLLOW USER */
    
    /* UPDATE USERDETAILS */
    // Save Posts
    .patch('/savePost/:id', verifyToken, userController.savePost) 
    // editProfile
    .patch('/editProfile/:userId', verifyToken, handleProfileAndCoverPics, userController.editProfile)

exports.router = router 