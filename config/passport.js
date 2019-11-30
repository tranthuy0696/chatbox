const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('../config/crypto')
const handleUser = require('../modules/user').handler

passport.serializeUser((user, cb) => {
  cb(null, user.username);
});

passport.deserializeUser((username, cb) => {
  handleUser.findByUsernameWithPassword(username).then((user) => {
    if (!user) {
      return cb(null, false)
    }
    cb(null, user)
  }).catch((er) => {
    return cb(null, false)
  })
});

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
},
(username, password, cb) => {
  handleUser.findByUsernameWithPassword(username).then((data) => {
    let user = data._doc
    if (!user || !crypto.matches(password, user.password)) {
      return cb(null, false)
    }
    return cb(null, user)
  }).catch((err) => {
    return cb(null, false)
  })
})
)


exports.passport = passport
