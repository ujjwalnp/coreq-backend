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
            userId,
            userFullName: user.fullName,
            title,
            description,
            votes: {},
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
        const queries = await Query.find()
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
        const queries = await Query.find({ userId })
        res.status(200).json(queries)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

/* UPDATE QUERY  -- This feature is still under development */

/* DELETE QUERY */
exports.deleteQuery = async(req, res)=>{
    try {
        // parse query's id from url
        const id = req.params.id
        
        try {
            // delete the article of specific id
            const deletedQuery = await Article.findOneAndDelete({ _id: id }).exec()
            res.status(200).json(deletedQuery)
        }
        catch(error) {
            res.status(404).json({ message: error.message })
        }
    }   
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}