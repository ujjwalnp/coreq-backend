const express = require('express')
const router = express.Router()
const userController = require('../controllers/users')
const { verifyToken } = require('../middlewares/auth')

/* GET USERDETAILS */
router.get('/get/:userId', verifyToken, userController.getUserDetails)


exports.router = router