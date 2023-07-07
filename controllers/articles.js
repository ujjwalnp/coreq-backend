const Article = require('../models/Article')
const User = require('../models/User')

/* CREATE ARTICLE */
exports.createArticle = async(req, res)=>{
    try{
        console.log('here')
        // parse data from body
        const { userId, title, description, authors, publicationYear, publicationHouse, keywords } = req.body
        
        // finding user's details from 'users' collection
        const user = await User.findById(userId)

        // creating new article using 'Article' Model
        const newArticle = new Article({
            userId,
            userFullName: user.fullName,
            username: user.username,
            title,
            description,
            authors,
            publicationYear,
            publicationHouse,
            keywords,
            votes: {},
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
        const articles = await Article.find().sort({ updatedAt: -1 }).exec()
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
        const articles = await Article.find({ userId }).sort({ updatedAt: -1 }).exec()
        res.status(200).json(articles)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}

exports.getSpecificArticle = async(req, res)=>{
    // parse articleId  from request body or query params
    const articleId = req.params.articleId

    try {
        const article = await Article.findById(articleId)
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

/* UPDATE ARTICLE  -- This feature is still under development */
exports.likeArticle = async(req, res)=>{
    try {
        const { id } = req.paramas
        const { userId } = req.body

        const article = await Article.findById(id)

        const isLiked = article.likes.get(userId)

        if (isLiked) {
            article.likes.delete(userId)
        }
        else {
            article.likes.set(userId, true)
        }

        const updatedArticle= await Article.findByIdAndUpdate(id, {likes: post.likes}, {new: true})

        res.status(200).json(updatedArticle)
    }
    catch(error) {
        res.status(404).json({ message: error.message })
    }

}

/* DELETE ARTICLE */
exports.deleteArticle = async(req, res)=>{
    try {
        // parse article's id from url
        const id = req.params.id
        
        try {
            // delete the article of specific id
            const deletedArticle = await Article.findOneAndDelete({ _id: id }).exec()
            res.status(200).json(deletedArticle)
        }
        catch(error) {
            res.status(404).json({ message: error.message })
        }
    }   
    catch(error) {
        res.status(404).json({ message: error.message })
    }
}