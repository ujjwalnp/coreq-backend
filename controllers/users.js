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
        if (req.body.batch && typeof req.body.batch === 'number') {
            user.batch = req.body.batch
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
        }

        // Save the updated user
        await user.save()

        res.status(200).json({ message: 'Profile updated successfully' })        
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}