const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/User')
const Article = require('../models/Article')
const Archive = require('../models/Archive')
const Project = require('../models/Project')

/* CREATE API */
// Save Article/Project/Archive/Query
exports.savePost = async(req, res) => {
    try {
        // parse postId as id from url
        const { id } = req.params

        // parse userId from body
        const { userId } = req.body
        
        // find user of specfic userId
        const user = await User.findById(userId)

        // check post is already present in collection
        const alreadySaved = user.savedPost.find((post) => post.postId.toString() === id.toString())
        console.log(alreadySaved)
        
       // if alreadySaved then unsave the post
       if (alreadySaved) {
        // Remove the post from savedPost array using `pull` method
        user.savedPost.pull(alreadySaved._id)
        await user.save()
        return res.status(200).json({ message: 'Post Unsaved successfully' })
    }

        // if !alreadySaved then save the post, create a new savedPost object
        const savedPostObject = {
            postId: id,
        }

        // push the savePostObject to user's savePost array
        user.savedPost.push(savedPostObject)
        await user.save()
        return res.status(201).json({ message: "Post Saved Successfully" })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// Follow / Unfollw Feature
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
            return res.status(404).json({ message: 'Following user not found' })
        }

        // Check whether already follows or requested for follow before adding it again
        const alreadyFollows = user.following.find((following) => following.followingId.toString() === followingId.toString())
        if (alreadyFollows) {
            if (alreadyFollows.isFollowing){
                // If already follows, update the isFollwing value to false
                alreadyFollows.isFollowing = false;
                await user.save()
                return res.status(200).json({ isFollowing: false, message: 'User UnFollowed successfully' })
            }
            else {
                // Update the isFollowing value to true
                alreadyFollows.isFollowing = true;
                await user.save()
                return res.status(200).json({ isFollowing: true, message: 'User followed successfully' })
            }
        }

        // Create a new following object
        const followingObject = {
            followingId: followingId,
            isFollowing: true,
        }
    
        // Push the following object to the user's following array
        user.following.push(followingObject);
        await user.save();

        res.status(200).json({ isFollowing: true, message: 'User followed successfully' })
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

exports.countSavedPosts = async(req, res) => {
    try {
        // parse userId from url
        const { userId } = req.params

        // find the user with the specific userId
        const user = await User.findById(userId)

        // count the number of saved posts for the user
        const count = user.savedPost.length

        res.status(200).json({ count })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getUserDetails = async(req, res) => {
    // parse userId from url
    const { userId } = req.params

    try {
        let user
        
        // Check if userId looks like an ObjectId (24-character hexadecimal)
        if (/^[0-9a-fA-F]{24}$/.test(userId)) {
            user = await User.findOne({ _id: userId }).select('-password')
        } else {
            user = await User.findOne({ username: userId }).select('-password')
        }

        if (!user) {
            // If no user found with the given userId, return a 404 response
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.getUserSavedPosts = async (req, res) => {
    try {
        // Get the userId from the URL
        const userId = req.params.userId

        // Find the user by userId
        const user = await User.findById(userId)

        // Get the user's saved post IDs
        const savedPostIds = user.savedPost
        console.log(savedPostIds)

        // Create an empty array to store the retrieved post details
        const savedPostsDetails = []

        // Loop through the saved post IDs and retrieve details for each post
        for (let postId of savedPostIds) {
            postId = postId.postId
            let postDetails

            // Check the type of the post and retrieve details accordingly
            const articlePost = await Article.findById(postId)
            if (articlePost) {
                postDetails = { type: 'Article', details: articlePost }
            } else {
                const archivePost = await Archive.findById(postId)
                if (archivePost) {
                    postDetails = { type: 'Archive', details: archivePost }
                } else {
                    const projectPost = await Project.findById(postId)
                    if (projectPost) {
                        postDetails = { type: 'Project', details: projectPost }
                    } else {
                        // Handle the case where a saved post is not found
                        // This can happen if a post was deleted or there's an issue with the savedPosts array
                        // You can choose to skip it or handle it differently based on your use case
                        console.log('No matching document was found in collection')
                        continue
                    }
                }
            }

            savedPostsDetails.push(postDetails)
        }

        // Send the retrieved post details as a response
        res.status(200).json({ count: savedPostsDetails.length, posts: savedPostsDetails })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.getUserFollowings = async(req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId)

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Get an array of followingIds with isFollowing === true
        const followingIds = user.following
        .filter((following) => following.isFollowing)
        .map((following) => following.followingId);

        // Get the count of followingIds
        const followingCount = followingIds.length;

        // Fetch the details of followingIds from the User collection
        const followingDetails = await User.find(
            { _id: { $in: followingIds } },
            'username fullName'
        );

        res.status(200).json({ followingDetails, followingCount });
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.isFollowing = async(req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId)
        const followingId = new mongoose.Types.ObjectId(req.body.followingId)

        const user = await User.findById(userId)
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }

        const isFollowing = user.following.find((following) => following.followingId.toString() === followingId.toString())

        if (isFollowing) {
            if (isFollowing.isFollowing) {
                return res.status(200).json({ isFollowing: true })
            }
            else {
                return res.status(200).json({ isFollowing: false })
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

exports.isFollower = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId)
      const followingId = new mongoose.Types.ObjectId(req.body.followingId)
  
      const user = await User.findById(followingId)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
  
      const isFollower = user.following.some(
        (following) => following.followingId.toString() === userId.toString()
      )
  
      res.status(200).json({ isFollower })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}
  
exports.getUserFollowers = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.params.userId)
  
      const user = await User.findById(userId)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
  
      // Get an array of followerIds
      const followerIds = await User.find({ 'following.followingId': userId }, '_id')
  
      // Fetch the details of followerIds from the User collection
      const followerDetails = await User.find(
        { _id: { $in: followerIds } },
        'username fullName'
      )
  
      const followerCount = followerIds.length
  
      res.status(200).json({ followerDetails, followerCount })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
}

/* UPDATE API */
exports.editProfile = async (req, res) => {
    // Parse userId from the URL
    const userId = new mongoose.Types.ObjectId(req.params.userId)
  
    try {
      // Get the user of the specific userId
      const user = await User.findById(userId).select('-email')
      if (!user) {
        // If no user found with the given userId, return a 404 response
        return res.status(404).json({ message: 'User not found' })
      }
  
      // Update username if available and not empty/whitespace
      if (req.body.username && req.body.username.trim() !== '') {
        user.username = req.body.username
      }
  
      // Handle profile picture upload
      if (req.files && req.files['profilePic']) {
        // Assuming you store the file path in req.files['profilePic'][0].path
        user.profilePic = req.files['profilePic'][0].path
      }
  
      // Handle cover picture upload
      if (req.files && req.files['coverPic']) {
        // Assuming you store the file path in req.files['coverPic'][0].path
        user.coverPic = req.files['coverPic'][0].path
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
        user.batch = Number(req.body.batch)
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
          user.socialNames.github = socialNames.github
        }
  
        // Update linkedin if available and not empty/whitespace
        if (socialNames.linkedin && socialNames.linkedin.trim() !== '') {
          user.socialNames.linkedin = socialNames.linkedin
        }
  
        // Update facebook if available and not empty/whitespace
        if (socialNames.facebook && socialNames.facebook.trim() !== '') {
          user.socialNames.facebook = socialNames.facebook
        }
  
        // Update twitter if available and not empty/whitespace
        if (socialNames.twitter && socialNames.twitter.trim() !== '') {
          user.socialNames.twitter = socialNames.twitter
        }
  
        // Update instagram if available and not empty/whitespace
        if (socialNames.instagram && socialNames.instagram.trim() !== '') {
          user.socialNames.instagram = socialNames.instagram
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
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  