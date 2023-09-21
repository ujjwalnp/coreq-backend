const Article = require('../models/Article')
const User = require('../models/User')

/* CREATE ARTICLE */
exports.createArticle = async(req, res)=>{
    try{
        // parse data from body
        const { userId, title, description, authors, publicationYear, publicationHouse, keywords } = req.body
        
        // Access the uploaded PDF file from req.file
        const pdfPath = req.file.path

        // finding user's details from 'users' collection
        const user = await User.findById(userId)

        // creating new article using 'Article' Model
        const newArticle = new Article({
            userId: userId,
            userFullName: user.fullName,
            username: user.username,
            title,
            description,
            authors,
            publicationYear,
            publicationHouse,
            keywords,
            articlePDFPath: pdfPath,
            votes: [],
            comments: [],
        })

        // saves newArticle
        await newArticle.save()

        // find all article(s) to display in feed
        const article = await Article.find()

        res.status(201).json(article)

    }
    catch(error) {
        res.status(409).json({ message: error.message })
    }
}

/* READ ARTICLES */
exports.getAllArticles = async(req, res)=>{
    try {
        // get all the articles from database
        const articles = await Article.find().sort({ createdAt: -1 }).exec()
        res.status(200).json(articles)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getUserArticles = async(req, res)=>{
    // parse userId from url
    const userId = req.params.userId

    try {
        // get the article(s) of specific userId
        const articles = await Article.find({ userId }).sort({ createdAt: -1 }).exec()
        res.status(200).json(articles)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getSpecificArticle = async(req, res)=>{
    // parse articleId as id from request body or query params
    const { id } = req.params

    try {
        const article = await Article.findById(id)
        res.status(200).json(article)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }

}

exports.getRecommendArticles = async(req, res)=>{
    try {
        // select random articles
        const recommendedArticles = await Article.aggregate([ { $sample: { size: 3 } }])

        res.status(200).json(recommendedArticles)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countUpVotes = async(req, res)=>{
    try {
        // parse articleId as id from url
        const { id } = req.params

        // find article of specfic id
        const article = await Article.findById(id)

        // count the number of upvotes
        const upVoteCount = article.votes.filter((vote) => vote.hasVoted == true).length

        res.status(200).json(upVoteCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countDownVotes = async(req, res)=>{
    try {
        // parse articleId as id from url
        const { id } = req.params

        // find article of specfic id
        const article = await Article.findById(id)

        // count the number of downvotes
        const downVoteCount = article.votes.filter((vote) => vote.hasVoted == false).length

        res.status(200).json(downVoteCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countComments = async(req, res)=>{
    try {
        // parse articleId as id from url
        const { id } = req.params

        // find article of specific id
        const article = await Article.findById(id)

        // count comments
        const commentCount = article.comments.length

        res.status(200).json(commentCount)
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

exports.countUserArticles = async(req, res)=>{
    try {
        // parse userId from url
        const userId = req.params.userId

        // count the number of articles of specific userId
        const count = await Article.countDocuments({ userId }).exec()

        res.status(200).json(count)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

/* UPDATE ARTICLE */
exports.commentArticle = async(req, res)=>{
    try{
        // parse articleId as id from url
        const { id } = req.params

        // parse userId & comment from body
        const { userId, comment } = req.body

        // find article of specfic id
        const article = await Article.findById(id)

        // create a new comment object
        const commentObject = {
            userId: userId,
            comment: comment,
        }

        // push the commentObject to article's comments array
        article.comments.push(commentObject)

        // save the article
        await article.save()
        res.status(201).json({ message: 'comment added' })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/* DELETE ARTICLE */
exports.deleteComment = async(req, res)=>{
    try {
        // parse articleId as id from url
        const { id } = req.params

        // parse commentId & userId from body
        const { commentId, userId } = req.body

        // find article of specfic id
        const article = await Article.findById(id)

        // find the comment of specific commentId
        const comment = article.comments.find((comment) => comment._id.toString() === commentId.toString())

        // check if the comment's userId == userId
        if (!comment || comment.userId.toString() !== userId.toString()) {
            return res.status(400).json({ message: 'Comment not found or You are not authorized to delete this comment.' })
        }
        
        // remove the comment from comments array using 'pull' method
        article.comments.pull({ _id: comment._id })
        await article.save()
        res.status(200).json('Comment deleted successfully.')
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}