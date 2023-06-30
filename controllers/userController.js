const UserModel = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// signup
exports.createUser = async (req, res) => {
  const {
    username,
    email,
    password,
    full_name,
    semester,
    bio,
    roll_no,
    faculty,
    batch,
    location,
    profile_pic,
  } = req.body
  // Perform validation checks using express-validator or other validation libraries

  try {
    // Check if the username or email is already registered
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" })
    }

    // Hash and salt the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      full_name,
      semester,
      bio,
      roll_no,
      faculty,
      batch,
      location,
      profile_pic,
    })

    try {
      await newUser.save()
      res.status(201).json({ message: "User registered successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Something went wrong" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
};

// login
exports.loginUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    // Check if the user exists
    const user = await UserModel.findOne({ $or: [{ username }, { email }] })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" })
    }

    // Create a session and store the user ID in the session
    req.session.userId = user._id

    const token = jwt.sign(
      { username: user.username, password: user.password },
      process.env.TOKEN_SCERECT_KEY
    );

    // Set the session ID as a cookie
    res.cookie("sessionId", req.sessionID, {
      httpOnly: true,
      // You can set other cookie options here if needed
    });

    console.log('login success')
    res.status(200).json({ message: "Login successful", token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// logout
exports.logoutUser = (req, res) => {
    // Destroy the session and clear the session cookie
    req.session.destroy()
    res.clearCookie("sessionId")
  
    res.status(200).json({ message: "Logout successful" })
  };
