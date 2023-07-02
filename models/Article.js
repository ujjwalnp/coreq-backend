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
    userId:{
        type: String, 
        required: true,
    },
    userFullName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: String,
    },
    publicationYear: {
        type: Number,
        defualt: 2023,
    },
    publicationHouse: {
        type: String,
    },
    description: {
        type: String,
    },
    userPicturePath: {
        type: String,
    },
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },  
    keywords: {
        type: String,
    }
},
{ timestamps: true }, 
)

const Article = mongoose.model('Article', articleSchema)


module.exports = Article