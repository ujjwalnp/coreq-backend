const Archive = require('../models/Archive')
const User = require('../models/User')

/* CREATE ARCHIVE */
exports.createArchive = async(req, res)=>{ 
    try{
        // parse data from body
        const { userId, title, collabrators, team, description, keywords } = req.body

        // Access the uploaded PDF file from req.file
        const pdfPath = req.file.path
        
        // finding user's details from 'users' collection
        const user = await User.findById(userId)

        // creating new archive using 'Archive' Model
        const newArchive = new Archive({
            userId: userId,
            userFullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            title,
            collabrators,
            team,
            description,
            keywords,
            archivePDFPath: pdfPath,
            votes: [],
            comments: [],
        })

        // saves newArchive
        await newArchive.save()

        // find all archive(s) to display in feed
        const archive = await Archive.find()

        res.status(201).json(archive)

    }
    catch(error) {
        res.status(409).json({ message: error.message })
    }
}

/* READ ARCHIVES */
exports.getAllArchives = async(req, res)=>{
    try {
        // get all the archives from database
        const archives = await Archive.find().sort({ createdAt: -1 }).exec()
        res.status(200).json(archives)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getUserArchives = async(req, res)=>{
    // parse userId from url
    const userId = req.params.userId

    try {
        // get the archive(s) of specific userId
        const archives = await Archive.find({ userId }).sort({ createdAt: -1 }).exec()
        res.status(200).json(archives)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getSpecificArchive = async(req, res)=>{
    // parse archiveId as id from request body or query params
    const { id } = req.params

    try {
        const archive = await Archive.findById(id)
        res.status(200).json(archive)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }

}

exports.countUserArchives = async(req, res)=>{
    try {
        // parse userId from url
        const userId = req.params.userId

        // count the number of archive of specific userId
        const count = await Archive.countDocuments({ userId }).exec()

        res.status(200).json(count)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countUpVotes = async(req, res)=>{
    try {
        // parse archiveId as id from url
        const { id } = req.params

        // find archive of specfic id
        const archive = await Archive.findById(id)

        // count the number of upvotes
        const upVoteCount = archive.votes.filter((vote) => vote.hasVoted == true).length

        res.status(200).json(upVoteCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countDownVotes = async(req, res)=>{
    try {
        // parse archiveId as id from url
        const { id } = req.params

        // find archive of specfic id
        const archive = await Archive.findById(id)

        // count the number of downvotes
        const downVoteCount = archive.votes.filter((vote) => vote.hasVoted == false).length

        res.status(200).json(downVoteCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countComments = async(req, res)=>{
    try {
        // parse archiveId as id from url
        const { id } = req.params

        // find archive of specific id
        const archive = await Archive.findById(id)

        // count comments
        const commentCount = archive.comments.length

        res.status(200).json(commentCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}


/* UPDATE ARCHIVE */
exports.commentArchive = async(req, res)=>{
    try{
        // parse archiveId as id from url
        const { id } = req.params

        // parse userId & comment from body
        const { userId, comment } = req.body

        // find archive of specfic id
        const archive = await Archive.findById(id)

        // create a new comment object
        const commentObject = {
            userId: userId,
            comment: comment,
        }

        // push the commentObject to archive's comments array
        archive.comments.push(commentObject)

        // save the archive
        await archive.save()
        res.status(201).json({ message: 'comment added' })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}


/* DELETE ARCHIVE */
exports.deleteComment = async(req, res)=>{
    try {
        // parse archiveId as id from url
        const { id } = req.params

        // parse commentId & userId from body
        const { commentId, userId } = req.body

        // find archive of specfic id
        const archive = await Archive.findById(id)

        // find the comment of specific commentId
        const comment = archive.comments.find((comment) => comment._id.toString() === commentId.toString())

        // check if the comment's userId == userId
        if (!comment || comment.userId.toString() !== userId.toString()) {
            return res.status(400).json({ message: 'Comment not found or You are not authorized to delete this comment.' })
        }
        
        // remove the comment from comments array using 'pull' method
        archive.comments.pull({ _id: comment._id })
        await archive.save()
        res.status(200).json('Comment deleted successfully.')
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}