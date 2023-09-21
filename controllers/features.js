const Archive = require("../models/Archive")
const Article = require("../models/Article")
const Project = require("../models/Project")
const Query = require("../models/Query")

/* CREATE */
/* READ */

/* UPDATE */
exports.upVotePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    let post
    // find post of specfic id
    const archive = await Archive.findById(id)
    if (archive) {
      post = archive
    } else {
      const article = await Article.findById(id)
      if (article) {
        post = article
      } else {
        const project = await Project.findById(id)
        if (project) {
          post = project
        } else {
          const query = await Query.findById(id)
          if (query) {
            post = query
          } else {
            return res.status(404).json({ message: "Post not found" })
          }
        }
      }
    }

    // check if userId of voted user is already present in the collection
    const alreadyUpVoted = post.votes.find(
      (voted) => voted.userId.toString() === userId.toString()
    )
    if (alreadyUpVoted) {
      if (alreadyUpVoted.hasVoted == true) {
        return res
          .status(400)
          .json({ message: "You have already upVoted this post." })
      } else {
        alreadyUpVoted.hasVoted = true
        await post.save()
        return res.status(201).json({ message: "Post UpVoted" })
      }
    }
    // add new vote to votes array and update it on database
    post.votes.push({ userId, hasVoted: true })
    await post.save()
    res.status(201).json({ message: "Post UpVoted" })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

exports.downVotePost = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body

    let post
    // find post of specfic id
    const archive = await Archive.findById(id)
    if (archive) {
      post = archive
    } else {
      const article = await Article.findById(id)
      if (article) {
        post = article
      } else {
        const project = await Project.findById(id)
        if (project) {
          post = project
        } else {
          const query = await Query.findById(id)
          if (query) {
            post = query
          } else {
            return res.status(404).json({ message: "Post not found" })
          }
        }
      }
    }

    // check if userId of voted user is already present in the collection
    const alreadyDownVoted = post.votes.find(
      (voted) => voted.userId.toString() === userId.toString()
    )
    if (alreadyDownVoted) {
      if (alreadyDownVoted.hasVoted == true) {
        alreadyDownVoted.hasVoted = false
        await post.save()
        return res.status(201).json({ message: "Post DownVoted" })
      } else {
        return res
          .status(400)
          .json({ message: "You have already downVoted this post." })
      }
    }
    // add new vote to votes array and update it on database
    post.votes.push({ userId, hasVoted: false })
    await post.save()
    res.status(201).json({ message: "Post DownVoted" })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

/* DELETE */
exports.deletePost = async (req, res) => {
    try {
      // Parse archive's id from url
      const { id } = req.params
      const { userId } = req.body
  
      // Find the post of specific id
      let post
  
      // Check for Archive
      post = await Archive.findById(id)
      if (!post) {
        // Check for Article
        post = await Article.findById(id)
        if (!post) {
          // Check for Project
          post = await Project.findById(id)
          if (!post) {
            // Check for Query
            post = await Query.findById(id)
          }
        }
      }
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' })
      }
  
      // Check if the post belongs to the specified user
      if (post.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this post' })
      }
  
      // Delete the post
      await post.deleteOne()
  
      res.status(200).json({ message: 'Post deleted successfully' })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
}