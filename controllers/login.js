const User = require("../models/user")
const bcrypt = require("bcrypt")
// const jwt = require('jsonwebtoken')

// app.post('/api/login', async (req, res) => {

exports.loginUser = async (req, res) => {
  const { username, password } = req.body

  try {
    // Check if the user exists
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" })
    }
    /*
    The token generation through JWT is remaining.. 
    do changes according to following code template and uncomment the 'const jwt = require('jsonwebtoken')'


    Generate a token for authentication (using JWT)
    const token = jwt.generateToken(user)

    res.status(200).json({ message: "Login successful", token })
    */

    res.status(200).json({ message: "Login successful"})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
