const mongoose = require('mongoose')
const User = require('../models/User')

/* READ API */
exports.getAllUsers = async(req, res) => {
    try{
        // get all the users from database
        const users = await User.find()
        res.status(200).json(users)
    }
    catch(error){
        res.status(404).json({ message: error.message })
    }
}

exports.getUserDetails = async(req, res) => {
    // parse userId from url
    const userId = new mongoose.Types.ObjectId(req.params.userId)

    try {
        // get the user of specific userId
        const user = await User.findById(userId).select('-password')

        if (!user) {
            // If no user found with the given userId, return a 404 response
            return res.status(404).json({ message: 'User not found' });
          }

          
        res.status(200).json(user)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}


