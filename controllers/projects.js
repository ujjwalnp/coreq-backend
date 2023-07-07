const Project = require('../models/Project')
const User = require('../models/User')

/* CREATE PROJECT */
exports.createProject = async(req, res)=>{
    try{
        // parse data from body
        const { userId, title, collabrators, team, description, keywords } = req.body
        
        // finding user's details from 'users' collection
        const user = await User.findById(userId)

        // creating new project using 'Project' Model
        const newProject = new Project({
            userId,
            userFullName: user.fullName,
            username: user.username,
            title,
            collabrators,
            team,
            description,
            keywords,
            votes: {},
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

/* READ ARTICLES */
exports.getAllProjects = async(req, res)=>{
    try {
        // get all the projects from database
        const projects = await Project.find().sort({ updatedAt: -1 }).exec()
        res.status(200).json(projects)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getUserProjects = async(req, res)=>{
    // parse userId from url
    const userId = req.params.userId

    console.log(userId)
    try {
        // get the project(s) of specific userId
        const projects = await Project.find({ userId }).sort({ updatedAt: -1 }).exec()
        res.status(200).json(projects)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getSpecificProject = async(req, res)=>{
    // parse projectId  from request body or query params
    const projectId = req.params.projectId

    try {
        const project = await Project.findById(projectId)
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


/* UPDATE PROJECT  -- This feature is still under development */

/* DELETE PROJECT */
exports.deleteProject = async(req, res)=>{
    try {
        // parse project's id from url
        const id = req.params.id
        
        try {
            // delete the project of specific id
            const deletedProject = await Project.findOneAndDelete({ _id: id }).exec()
            res.status(200).json(deletedProject)
        }
        catch(error) {
            res.status(404).json({ message: error.message })
        }
    }   
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}