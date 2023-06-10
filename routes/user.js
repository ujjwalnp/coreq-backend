const express = require("express");
const router = express.Router();
// const userController = require("../controller/user")
const signupController = require('../controllers/signup')
const loginController = require('../controllers/login')

// app.post('/api/signup', async (req, res) => {

router
  // SIGNUP_USER API
  .post('/signup', signupController.createUser)

  // LOGIN_USER API
  .post('/login', loginController.loginUser)

exports.router = router
