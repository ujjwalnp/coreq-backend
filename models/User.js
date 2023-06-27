const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Check if the email ends with '@cosmoscollege.edu.np'
          return value.endsWith('@cosmoscollege.edu.np');
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    roll_no: {
      type: Number,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
    following: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    join_date: {
      type: Date,
      default: Date.now
    }
  })
  
  const User = mongoose.model('User', userSchema)
  
  module.exports = User