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
  })
  
  const UserCredentials = mongoose.model('UserCredentials', userSchema)
  
  module.exports = UserCredentials