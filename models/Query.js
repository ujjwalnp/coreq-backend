const mongoose = require('mongoose')
const { Schema } = mongoose

const querySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
})

const Query = mongoose.model('Query', querySchema)


module.exports = Query