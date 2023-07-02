const express = require("express")
const router = express.Router()
const authController = require('../controllers/auth')

router
  /* SIGNUP_USER API */
  .post('/signup', authController.createUser)

  /* LOGIN_USER API */
  .post('/login', authController.loginUser)


exports.router = router
