const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const { verifyToken } = require('../middlewares/auth')

router
/* GET USERDETAILS */
    .get('/get/:userId', verifyToken, userController.getUserDetails)

/* UPDATE USERDETAILS */
    // editProfile
    .patch('/editProfile/:userId', userController.editProfile);

exports.router = router