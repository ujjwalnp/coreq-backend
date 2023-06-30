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
    full_name: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      defualt: 0,
    },
    bio: {
      type: String,
      default: null,
    },
    roll_no: {
      type: Number,
      default: 0,
    },
    faculty: {
      type: String,
      defualt: null,
    },
    batch: {
      type: Number,
    },
    location: {
      type: String,
      default: null,
    },
    profile_pic: {
      type: String,
      default: null,
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