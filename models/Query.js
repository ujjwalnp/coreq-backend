const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
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

const querySchema = new Schema({
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
    tag: {
        type: String,
        default: 'Query',
    },

},
{ timestamps: true },
)

const Query = mongoose.model('Query', querySchema)


module.exports = Query