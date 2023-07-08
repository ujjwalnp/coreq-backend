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

/* UPDATE ARCHIVE  -- This feature is still under development */


/* DELETE ARCHIVE */
exports.deleteArchive = async(req, res)=>{
    try {
        // parse archive's id from url
        const id = req.params.id
        
        try {
            // delete the archive of specific id
            const deletedArchive = await Archive.findOneAndDelete({ _id: id }).exec()
            res.status(200).json(deletedArchive)
        }
        catch(error) {
            res.status(404).json({ message: error.message })
        }
    }   
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}