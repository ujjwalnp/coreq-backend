const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comment: {
        type: String,
    },
},
{ timestamps: true },
)

const voteSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    hasVoted: {
        type: Boolean,
    },
},
    {timestamps: true}
)

const articleSchema = new Schema({
    userId:{
        type: String,   
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    userFullName: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: String,
        required: true,
    },
    publicationYear: {
        type: Number,
        required: true,
        defualt: 2023,
    },
    publicationHouse: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userPicturePath: {
        type: String,
    },
    articlePDFPath: {
        type: String,
    },
    votes: [voteSchema],
    comments: [commentSchema],
    keywords: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: 'Article',
    },
},
    { timestamps: true }, 
)

const Article = mongoose.model('Article', articleSchema)


module.exports = Article