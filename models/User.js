const mongoose = require("mongoose")
const { Schema } = mongoose

const userFollowingSchema = new Schema({
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isFollowing: {
    type: Boolean,
  },
},
  {timestamps: true},
)

const savedPostSchema = new Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'postType'
  },
  postType: {
    type: String,
    enum: ['Article', 'Archive', 'Project', 'Query']
  }
})

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
        return value.endsWith("@cosmoscollege.edu.np");
      },
    },
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
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
  rollNo: {
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
  socialNames: {
    github: {
      type: String,
      defualt: null,
    },
    linkedin: {
      type: String,
      defualt: null,
    },
    facebook: {
      type: String,
      defualt: null,
    },
    twitter: {
      type: String,
      defualt: null,
    },
    instagram: {
      type: String,
      defualt: null,
    },
  },
  profilePic: {
    type: String,
    default: null,
  },
  coverPic: {
    type: String,
    default: null,
  },
  following: [userFollowingSchema],
  popularity: {
    type: Number,
    default: 0,
  },
  savedPost: [savedPostSchema],
},
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User
