const User = require('../models/user')
const bcrypt = require('bcrypt')

// app.post('/api/signup', async (req, res) => {

exports.createUser = async(req, res) => {
    const { username, email, password } = req.body
  
    // Perform validation checks using express-validator or other validation libraries
  
    try {
      // Check if the username or email is already registered
      const existingUser = await User.findOne({ $or: [{ username }, { email }] })
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' })
      }
  
      // Hash and salt the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10)
  
      // Create a new user
      const newUser = new User({ username, email, password: hashedPassword })
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' })
    }
  }
  