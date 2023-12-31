const Project = require('../models/Project')
const User = require('../models/User')

/* CREATE PROJECT */
exports.createProject = async(req, res)=>{
    try{
        // parse data from body
        const { userId, title, collabrators, team, description, keywords } = req.body

        // Access the uploaded PDF file from req.file
        const pdfPath = req.file.path
        
        // finding user's details from 'users' collection
        const user = await User.findById(userId)

        // creating new project using 'Project' Model
        const newProject = new Project({
            userId: userId,
            userFullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            title,
            collabrators,
            team,
            description,
            keywords,
            projectPDFPath: pdfPath,
            votes: [],
            comments: [],
        })

        // saves newProject
        await newProject.save()

        // find all project(s) to display in feed
        const project = await Project.find()

        res.status(201).json(project)

    }
    catch(error) {
        res.status(409).json({ message: error.message })
    }
}

/* READ PROJECTS */
exports.getAllProjects = async(req, res)=>{
    try {
        // get all the projects from database
        const projects = await Project.find().sort({ createdAt: -1 }).exec()
        res.status(200).json(projects)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getUserProjects = async(req, res)=>{
    // parse userId from url
    const userId = req.params.userId

    try {
        // get the project(s) of specific userId
        const projects = await Project.find({ userId }).sort({ createdAt: -1 }).exec()
        res.status(200).json(projects)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getSpecificProject = async(req, res)=>{
    // parse projectId as id from request body or query params
    const { id } = req.params

    try {
        const project = await Project.findById(id)
        res.status(200).json(project)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }

}

exports.getRecommendProjects = async(req, res)=>{
    try {
        // select random projects
        const recommendedProjects = await Project.aggregate([ { $sample: { size: 3 } }])

        res.status(200).json(recommendedProjects)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countUserProjects = async(req, res)=>{
    try {
        // parse userId from url
        const userId = req.params.userId

        // count the number of projects of specific userId
        const count = await Project.countDocuments({ userId }).exec()

        res.status(200).json(count)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countUpVotes = async(req, res)=>{
    try {
        // parse projectId as id from url
        const { id } = req.params

        // find project of specfic id
        const project = await Project.findById(id)

        // count the number of upvotes
        const upVoteCount = project.votes.filter((vote) => vote.hasVoted == true).length

        res.status(200).json(upVoteCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countDownVotes = async(req, res)=>{
    try {
        // parse projectId as id from url
        const { id } = req.params

        // find project of specfic id
        const project = await Project.findById(id)

        // count the number of downvotes
        const downVoteCount = project.votes.filter((vote) => vote.hasVoted == false).length

        res.status(200).json(downVoteCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countComments = async(req, res)=>{
    try {
        // parse projectId as id from url
        const { id } = req.params

        // find project of specific id
        const project = await Project.findById(id)

        // count comments
        const commentCount = project.comments.length

        res.status(200).json(commentCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/* UPDATE PROJECT */
exports.commentProject = async(req, res)=>{
    try{
        // parse projectId as id from url
        const { id } = req.params

        // parse userId & comment from body
        const { userId, comment } = req.body

        // find project of specfic id
        const project = await Project.findById(id)

        // create a new comment object
        const commentObject = {
            userId: userId,
            comment: comment,
        }

        // push the commentObject to project's comments array
        project.comments.push(commentObject)

        // save the project
        await project.save()
        res.status(201).json({ message: 'comment added' })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/* DELETE PROJECT */
exports.deleteComment = async(req, res)=>{
    try {
        // parse projectId as id from url
        const { id } = req.params

        // parse commentId & userId from body
        const { commentId, userId } = req.body

        // find project of specfic id
        const project = await Project.findById(id)

        // find the comment of specific commentId
        const comment = project.comments.find((comment) => comment._id.toString() === commentId.toString())

        // check if the comment's userId == userId
        if (!comment || comment.userId.toString() !== userId.toString()) {
            return res.status(400).json({ message: 'Comment not found or You are not authorized to delete this comment.' })
        }
        
        // remove the comment from comments array using 'pull' method
        project.comments.pull({ _id: comment._id })
        await project.save()
        res.status(200).json('Comment deleted successfully.')
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}