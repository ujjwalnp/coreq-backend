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

const archiveSchema = new Schema({
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
    title: {
        type: String,
        required: true,
    },
    collabrators: {
        type: String,
        required: true,
    },
    team: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    votes: [voteSchema],
    comments: [commentSchema],  
    keywords: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: 'Archive',
    },
})

const Archive = mongoose.model('Archive', archiveSchema)


module.exports = Archive