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
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
{ timestamps: true },
)

const Query = mongoose.model('Query', querySchema)


module.exports = Query