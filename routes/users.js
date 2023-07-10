const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const { verifyToken } = require('../middlewares/auth')

router
/* GET USERDETAILS */
    .get('/get/:userId', verifyToken, userController.getUserDetails)
    .get('/get/:userId/followings', verifyToken, userController.getUserFollowings)
    .get('/get/:userId/followers', verifyToken, userController.getUserFollowers)
    .get('/get/:userId/isFollower', verifyToken, userController.isFollower)

/* FOLLOW USER */
    .post('/follow/:userId', verifyToken, userController.followUser)
    /* UNFOLLOW USER */

/* UPDATE USERDETAILS */
    // editProfile
    .patch('/editProfile/:userId', userController.editProfile);

exports.router = router