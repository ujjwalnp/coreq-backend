const express = require("express");
const router = express.Router();
// const userController = require("../controller/user")
const signupController = require('../controllers/signup')

// app.post('/api/signup', async (req, res) => {

// SIGNUP_USER API
router.post("/signup", signupController.createUser)

exports.router = router
