const User = require('../user').model
const {passport} = require('../../config/passport')
const {send} = require('../send')

const checkUser = (req, res, next) => {
    const username = req.body.username
    User.findOne({username, enabled: true}).exec()
      .then((user) => {
        if (user) {
          req.authentication = user.authentication
          next()
        } else {
          send(400, 'Invalid username', req, next)
          res.end()
        }
      })
}

const internalAuthen = (req, res, next) => {
    passport.authenticate('local', {session: !req.sendingToken}, (err, user) => {
    	if (err) {
			req.data = err
			return next(err)
        }
		if (!user) {
			req.code = 400
			return next()
		}
    	doLogin(user, req, res, next)
    })(req, res, next)
}