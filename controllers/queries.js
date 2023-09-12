const Query = require('../models/Query')
const User = require('../models/User')

/* CREATE QUERY */
exports.createQuery = async(req, res)=>{
    try{
        // parse data from body
        const { userId, title, description } = req.body
        
        // finding user's details from 'users' collection
        const user = await User.findById(userId)

        // creating new queries using 'Query' Model
        const newQuery = new Query({
            userId: userId,
            userFullName: user.fullName,
            username: user.username,
            title,
            description,
            votes: [],
            comments: [],
        })

        // saves newQuery
        await newQuery.save()

        // find all query(s) to display in feed
        const query = await Query.find()

        res.status(201).json(query)

    }
    catch(error) {
        res.status(409).json({ message: error.message })
    }
}

/* READ QUERIES */
exports.getAllQueries = async(req, res)=>{
    try {
        // get all the queries from database
        const queries = await Query.find().sort({ updatedAt: -1 }).exec()
        res.status(200).json(queries)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getUserQueries = async(req, res)=>{
    // parse userId from url
    const userId = req.params.userId

    console.log(userId)
    try {
        // get the query(s) of specific userId
        const queries = await Query.find({ userId }).sort({ updatedAt: -1 }).exec()
        res.status(200).json(queries)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countUserQueries = async(req, res)=>{
    try {
        // parse userId from url
        const userId = req.params.userId

        // count the number of queries of specific userId
        const count = await Query.countDocuments({ userId }).exec()

        res.status(200).json(count)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getSpecificQuery = async(req, res)=>{
    try {
        // parse queryId as id from request body or query params
        const { id } = req.params

        // get query of specific id
        const query = await Query.findById(id)
        res.status(200).json(query)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countUpVotes = async(req, res)=>{
    try {
        // parse queryId as id from url
        const { id } = req.params

        // find query of specfic id
        const query = await Query.findById(id)

        // count the number of upvotes
        const upVoteCount = query.votes.filter((vote) => vote.hasVoted == true).length

        res.status(200).json(upVoteCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countDownVotes = async(req, res)=>{
    try {
        // parse queryId as id from url
        const { id } = req.params

        // find query of specfic id
        const query = await Query.findById(id)

        // count the number of downvotes
        const downVoteCount = query.votes.filter((vote) => vote.hasVoted == false).length

        res.status(200).json(downVoteCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countComments = async(req, res)=>{
    try {
        // parse queryId as id from url
        const { id } = req.params

        // find query of specific id
        const query = await Query.findById(id)

        // count comments
        const commentCount = query.comments.length

        res.status(200).json(commentCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/* UPDATE QUERY */
exports.upVoteQuery = async(req, res)=>{
    try {
        const { id } = req.params 
        const { userId } = req.body
        
        // find query of specfic id
        const query = await Query.findById(id)

        // check if userId of voted user is already present in the collection 
        const alreadyUpVoted = query.votes.find((voted) => voted.userId.toString() === userId.toString())
        if (alreadyUpVoted) {
            if (alreadyUpVoted.hasVoted == true) {
                return res.status(400).json({ message: 'You have already upVoted this query.' })
            }
            else {
                alreadyUpVoted.hasVoted = true
                await query.save()
                return res.status(201).json({ message: 'Query UpVoted' })
            }
        }
        // add new vote to votes array and update it on database
        query.votes.push({ userId, hasVoted: true })
        await query.save()
        res.status(201).json({ message: 'Query UpVoted' })
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.downVoteQuery = async(req, res)=>{
    try {
        const { id } = req.params 
        const { userId } = req.body
        
        // find query of specfic id
        const query = await Query.findById(id)

        // check if userId of voted user is already present in the collection 
        const alreadyDownVoted = query.votes.find((voted) => voted.userId.toString() === userId.toString())
        if (alreadyDownVoted) {
            if (alreadyDownVoted.hasVoted == true) {
                alreadyDownVoted.hasVoted = false
                await query.save()
                return res.status(201).json({ message: 'Query DownVoted' })
            }
            else {
                return res.status(400).json({ message: 'You have already downVoted this query.' })
            }
        }
        // add new vote to votes array and update it on database
        query.votes.push({ userId, hasVoted: false })
        await query.save()
        res.status(201).json({ message: 'Query DownVoted' })
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.commentQuery = async(req, res)=>{
    try{
        // parse queryId as id from url
        const { id } = req.params

        // parse userId & comment from body
        const { userId, comment } = req.body

        // find query of specfic id
        const query = await Query.findById(id)

        // create a new comment object
        const commentObject = {
            userId: userId,
            comment: comment,
        }

        // push the commentObject to article's comments array
        query.comments.push(commentObject)

        // save the query
        await query.save()
        res.status(201).json({ message: 'comment added' })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/* DELETE QUERY */
exports.deleteQuery = async(req, res)=>{
    try {
        // parse query's id from url
        const userId = req.params.userId
        const { id } = req.body
        
        try {
            // delete the query of specific id
            const deletedQuery = await Query.findOneAndDelete({ 
                _id: id,
                userId: userId
            }).exec()

            if (!deletedQuery) {
                return res.status(404).json({ message: "Query not found." });
            }

            res.status(200).json(deletedQuery)
        }
        catch(error) {
            res.status(500).json({ message: error.message })
        }
    }   
    catch(error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteComment = async(req, res)=>{
    try {
        // parse queryId as id from url
        const { id } = req.params

        // parse commentId & userId from body
        const { commentId, userId } = req.body

        // find query of specfic id
        const query = await Query.findById(id)

        // find the comment of specific commentId
        const comment = query.comments.find((comment) => comment._id.toString() === commentId.toString())

        // check if the comment's userId == userId
        if (!comment || comment.userId.toString() !== userId.toString()) {
            return res.status(400).json({ message: 'Comment not found or You are not authorized to delete this comment.' })
        }
        
        // remove the comment from comments array using 'pull' method
        query.comments.pull({ _id: comment._id })
        await query.save()
        res.status(200).json('Comment deleted successfully.')
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}