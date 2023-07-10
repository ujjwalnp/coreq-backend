const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/User')

/* CREATE API */
exports.followUser = async(req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId)
        const followingId = new mongoose.Types.ObjectId(req.body.followingId)
        
        // get the user of specific userId
        const user = await User.findById(userId)
        const followingUser = await User.findById(followingId)
        
        if (!user) {
            // If no user found with the given userId, return a 404 response
            return res.status(404).json({ message: 'User not found' })
        }
        if (!followingUser) {
            return res.status(404).json({ message: 'Following user not found' });
        }

        // Check whether already follows or requested for follow before adding it again
        const alreadyFollows = user.following.find((following) => following.followingId.toString() === followingId.toString())
        console.log(alreadyFollows)
        if (alreadyFollows) {
            // If already follows, return a 400 response
            return res.status(400).json({ message: 'Already follows' })
        }

        // Check the user is followed by followingId or not
        const isFollower = followingUser.following.find((following) => following.followingId.toString() === userId.toString())

        // Set variable based on isFollower value
        const isFollowerValue = isFollower ? true : false; 

        // Create a new following object
        const followingObject = {
            followingId: followingId,
            isFollower: isFollowerValue,
        }
    
        // Push the following object to the user's following array
        user.following.push(followingObject);
        await user.save();

        res.status(200).json({ message: 'User followed successfully' })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

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

exports.getUserFollowings = async(req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId)

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Get an array of followingIds
        const followingIds = user.following.map((following) => following.followingId)
        
        // finding length of followingIds to determine total no of following
        const followingIdsArrayLength = followingIds.length

        // Fetch the details of followingIds from the User collection
        const followingDetails = await User.find(
            { _id: { $in: followingIds } },
            'username fullName'
        )

        res.status(200).json({ followingDetails, followingCount: followingIdsArrayLength })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.isFollower = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId);
      const followingId = new mongoose.Types.ObjectId(req.body.followingId);
  
      const user = await User.findById(followingId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isFollower = user.following.some(
        (following) => following.followingId.toString() === userId.toString()
      );
  
      res.status(200).json({ isFollower });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


exports.getUserFollowers = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId);
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Get an array of followerIds
      const followerIds = await User.find({ 'following.followingId': userId }, '_id');
  
      // Fetch the details of followerIds from the User collection
      const followerDetails = await User.find(
        { _id: { $in: followerIds } },
        'username fullName'
      );
  
      const followerCount = followerIds.length;
  
      res.status(200).json({ followerDetails, followerCount });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


/* UPDATE API */
exports.editProfile = async(req, res) => {
    // parse userId from url
    const userId = new mongoose.Types.ObjectId(req.params.userId)

    try {
        // get the user of specific userId
        const user = await User.findById(userId).select('-email')
        if (!user) {
            // If no user found with the given userId, return a 404 response
            return res.status(404).json({ message: 'User not found' })
        }

        // Update username if available and not empty/whitespace
        if (req.body.username && req.body.username.trim() !== '') {
            user.username = req.body.username
        }

        // Update profile picture if available and not empty/whitespace
        if (req.body.profilePic && req.body.profilePic.trim() !== '') {
            user.profilePic = req.body.profilePic
        }
    
        // Update cover picture if available and not empty/whitespace
        if (req.body.coverPic && req.body.coverPic.trim() !== '') {
            user.coverPic = req.body.coverPic
        }
    
        // Update full name if available and not empty/whitespace
        if (req.body.fullName && req.body.fullName.trim() !== '') {
            user.fullName = req.body.fullName
        }
    
        // Update bio if available and not empty/whitespace
        if (req.body.bio && req.body.bio.trim() !== '') {
            user.bio = req.body.bio
        }
    
        // Update batch if available and not empty/whitespace
        if (req.body.batch && !isNaN(req.body.batch)) {
            user.batch = Number(req.body.batch);
          }
    
        // Update faculty if available and not empty/whitespace
        if (req.body.faculty && req.body.faculty.trim() !== '') {
            user.faculty = req.body.faculty
        }
    
        // Update social media links if available
        if (req.body.socialNames) {
            const socialNames = req.body.socialNames
    
            
            // Update github if available and not empty/whitespace
            if (socialNames.github && socialNames.github.trim() !== '') {
                user.socialNames.github = socialNames.github;
            }

            // Update linkedin if available and not empty/whitespace
            if (socialNames.linkedin && socialNames.linkedin.trim() !== '') {
                user.socialNames.linkedin = socialNames.linkedin;
            }

            // Update facebook if available and not empty/whitespace
            if (socialNames.facebook && socialNames.facebook.trim() !== '') {
                user.socialNames.facebook = socialNames.facebook;
            }

            // Update twitter if available and not empty/whitespace
            if (socialNames.twitter && socialNames.twitter.trim() !== '') {
                user.socialNames.twitter = socialNames.twitter;
            }

            // Update instagram if available and not empty/whitespace
            if (socialNames.instagram && socialNames.instagram.trim() !== '') {
                user.socialNames.instagram = socialNames.instagram;
            }
        }
        // Update password if available (verified by old password)
        if (req.body.password && req.body.oldPassword) {
            const isOldPasswordValid = await bcrypt.compare(req.body.oldPassword, user.password)
    
            if (!isOldPasswordValid) {
                return res.status(400).json({ message: 'Invalid old password' })
            }
    
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            user.password = hashedPassword
            await user.save()
            return res.status(200).json({ message: 'Password updated Successfully' })
        }

        // Save the updated user
        await user.save()

        res.status(200).json({ message: 'Profile updated successfully' })        
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}