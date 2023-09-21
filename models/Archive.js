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
    profilePic: {
        type: String,
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
    archivePDFPath: {
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
        default: 'Archive',
    },
},
    { timestamps: true },
)

const Archive = mongoose.model('Archive', archiveSchema)


module.exports = Archive