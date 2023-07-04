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


exports.getFriendSuggestions = async (req, res) => {
    try {
      // Get the count of all users in the database
      const totalCount = await User.countDocuments();
  
      // Select 3 random users using the $sample aggregation operator
      const selectedUsers = await User.aggregate([{ $sample: { size: 3 } }]);
  
      res.status(200).json(selectedUsers);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

// Utility function to select random elements from an array
function getRandomElements(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }