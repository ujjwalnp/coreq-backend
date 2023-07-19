const Archive = require('../models/Archive')
const User = require('../models/User')

/* CREATE ARCHIVE */
exports.createArchive = async(req, res)=>{
    try{
        // parse data from body
        const { userId, title, collabrators, team, description, keywords } = req.body
        
        // finding user's details from 'users' collection
        const user = await User.findById(userId)

        // creating new archive using 'Archive' Model
        const newArchive = new Archive({
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
        const archives = await Archive.find().sort({ updatedAt: -1 }).exec()
        res.status(200).json(archives)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getUserArchives = async(req, res)=>{
    // parse userId from url
    const userId = req.params.userId

    console.log(userId)
    try {
        // get the archive(s) of specific userId
        const archives = await Archive.find({ userId }).sort({ updatedAt: -1 }).exec()
        res.status(200).json(archives)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getSpecificArchive = async(req, res)=>{
    // parse archiveId  from request body or query params
    const archiveId = req.params.archiveId

    try {
        const archive = await Archive.findById(archiveId)
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

exports.getUpVoteCount = async(req, res)=>{
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

exports.getDownVoteCount = async(req, res)=>{
    try {
        // parse articleId as id from url
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

/* UPDATE ARCHIVE */
exports.upVoteArchive = async(req, res)=>{
    try {
        const { id } = req.params 
        const { userId } = req.body
        
        // find archive of specfic id
        const archive = await Archive.findById(id)

        // check if userId of voted user is already present in the collection 
        const alreadyUpVoted = archive.votes.find((voted) => voted.userId.toString() === userId.toString())
        if (alreadyUpVoted) {
            if (alreadyUpVoted.hasVoted == true) {
                return res.status(400).json({ message: 'You have already upVoted this archive.' })
            }
            else {
                alreadyUpVoted.hasVoted = true
                await archive.save()
                return res.status(201).json({ message: 'Archive UpVoted' })
            }
        }
        // add new vote to votes array and update it on database
        archive.votes.push({ userId, hasVoted: true })
        await archive.save()
        res.status(200).json({ message: 'Archive UpVoted' })
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.downVoteArchive = async(req, res)=>{
    try {
        const { id } = req.params 
        const { userId } = req.body
        
        // find archive of specfic id
        const archive = await Archive.findById(id)

        // check if userId of voted user is already present in the collection 
        const alreadyDownVoted = archive.votes.find((voted) => voted.userId.toString() === userId.toString())
        if (alreadyDownVoted) {
            if (alreadyDownVoted.hasVoted == true) {
                alreadyDownVoted.hasVoted = false
                await archive.save()
                return res.status(201).json({ message: 'Archive DownVoted' })
            }
            else {
                return res.status(400).json({ message: 'You have already downVoted this archive.' })
            }
        }
        // add new vote to votes array and update it on database
        archive.votes.push({ userId, hasVoted: false })
        await archive.save()
        res.status(200).json({ message: 'Archive DownVoted' })
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}


/* DELETE ARCHIVE */
exports.deleteArchive = async(req, res)=>{
    try {
        // parse archive's id from url
        const userId = req.params.userId
        const { id } = req.body
        
        try {
            // delete the archive of specific id
            const deletedArchive = await Archive.findOneAndDelete({ 
                _id: id,
                userId: userId
            }).exec()

            if (!deletedArchive) {
                return res.status(404).json({ message: "Archive not found." });
            }

            res.status(200).json(deletedArchive)
        }
        catch(error) {
            res.status(500).json({ message: error.message })
        }
    }   
    catch(error) {
        res.status(400).json({ message: error.message })
    }
}