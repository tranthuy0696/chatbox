const mongoose = require('mongoose')
const crypto = require('../../config/crypto')

const userSchema = new mongoose.Schema({
  _version: {
    type: Number,
    default: 1,
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    index: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    index: true,
  },
  password: String,
  firstName: String,
  lastName: String,
  image: String,
  enabled: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
  versionKey: false,
})

userSchema.pre('save', function(next) {
  let user = this
  if (user.isModified('password') && this.password !== '') {
    this.password = crypto.encrypt(this.password)
  }
  next()
})

module.exports = mongoose.model('user', userSchema, 'users')
