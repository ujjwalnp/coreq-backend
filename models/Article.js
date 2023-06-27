const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
    text: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: String,
    },
    publication_year: {
        type: Number,
        defualt: 2023,
    },
    publication_house: {
        type: String,
    },
    description: {
        type: String,
    },
    upvote: {
        type: Number,
        default: 0,
    },
    downvote: {
        type: Number,
        default: 0,
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },  
    keywords: {
        type: String,
    },  
})

const Article = mongoose.model('Article', articleSchema)


module.exports = Article