const UserModel = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { exec } = require('child_process')

/* SIGNUP */
exports.createUser = async (req, res) => {
  const {
    username,
    email,
    password,
    fullName,
    semester,
    bio,
    rollNo,
    faculty,
    batch,
    location,
    profilePic,
  } = req.body

  try {
    // Check if the username or email is already registered
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    })
    if (existingUser) {
      return res.status(400).json({ message: "Signup: Username or email already exists" })
    }

    // Hash and salt the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      fullName,
      semester,
      bio,
      rollNo,
      faculty,
      batch,
      location,
      profilePic,
    })

    try {
      await newUser.save()
      console.log('Signup: User registered successfully')
      res.status(201).json({ newUser, message: "Signup: User registered successfully" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* LOGIN */
exports.loginUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    // Check if the user exists
    const user = await UserModel.findOne({ $or: [{ username }, { email }] })
    if (!user) {
      console.log('Login: Invalid Username or Email')
      return res.status(404).json({ message: "Login: Invaild User" })
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.log('Login: Invalid Password')
      return res.status(401).json({ message: "Login: Invalid password" })
    }

    // Create a session and store the user ID in the session
    req.session.userId = user._id

    const token = jwt.sign(
      { id: user.userId, username: user.username, password: user.password },
      process.env.JWT_SECRET
    )

    // Set the session ID as a cookie
    res.cookie("sessionId", req.sessionID, {
      httpOnly: true,
      // other cookie option(s)
    })

    console.log('Login: Login successful')

    // Execute the command (e.g., 'pwd') here
    exec("pwd", (error, stdout, stderr) => {
      if (error) {
        console.error(error.message)
        res.status(500).json({ error: "An error occurred." })
        return
      }
      if (stderr) {
        console.error(stderr)
        res.status(500).json({ error: "An error occurred." })
        return
      }
      const pwd = stdout.trim() // Trim any extra whitespace
      res.status(200).json({ pwd, token, userId: user._id, message: "Login: Login successful" })
    })
  } catch (error) {
    res.status(500).json({ message: "Login: Server error" })
  }
}

/* LOGOUT */
exports.logoutUser = (req, res) => {
    // Destroy the session and clear the session cookie
    req.session.destroy()
    res.clearCookie("sessionId")
  
    res.status(200).json({ message: "Logout successful" })
}
