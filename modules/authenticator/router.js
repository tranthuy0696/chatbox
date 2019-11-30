const express = require('express')
const router = new express.Router()
const {passport} = require('../../config/passport')
const User = require('../user').model

const doLogin = (req, res, next) => {
    res.cookie('authenticated', true)
    let cloneUser = Object.assign({}, req.user)
    delete cloneUser.password
    res.status(200).json(cloneUser)
}

const checkUser = (req, res, next) => {
  const username = req.body.username
  User.findOne({username, enabled: true}).exec()
    .then((user) => {
      if (user) {
        req.authentication = user.authentication
        req.user = user
        next()
      } else {
        res.status(400).send('Invalid username')
        res.end()
      }
    })
}

/**
 * @api {POST} /auth/login Login
 * @apiName Login
 * @apiGroup Authentication
 * @apiPermission none
 *
 * @apiParam (Body) {String} username Username
 * @apiParam (Body) {String} password Password
 *
 * @apiSuccess {String} _id User ID
 * @apiSuccess {String} username Username
 * @apiSuccess {String} firstName User first name
 * @apiSuccess {String} lastName User last name
 * @apiSuccess {String} email User email
 * @apiSuccess {String} timezone User timezone
 * @apiSuccess {String} language User language code
 * @apiSuccess {String} role Role of the user account
 * @apiSuccess {String} authentication User account authentication method
 * @apiSuccess {Boolean} enabled Whether the user account is enabled or not
 * @apiSuccess {String} createdAt The date string when user account created
 * @apiSuccess {String} updatedAt The date string when user account updated last time
 * @apiSuccess {Object[]} orgs Environments granted to the user account
 * @apiSuccess {String} orgs._id Environment ID
 * @apiSuccess {String} orgs.name Environment name
 * @apiSuccess {String} orgs.language Environment language code
 * @apiSuccess {Boolean} orgs.writable Whether the user account has enough privilege perform update/delete actions on this environment
 * @apiSuccess {Object[]} favoriteSelfServices User favorite self services
 * @apiSuccess {Object[]} selfServiceGroups Self-service groups granted for this user account
 *
 * @apiError {String} 400 Invalid username
 */
router.post('/login', checkUser, passport.authenticate('local'), doLogin)

/**
 * @api {GET} /auth/logout Logout
 * @apiName Logout
 * @apiGroup Authentication
 * @apiPermission none
 */
router.get('/logout', function(req, res, next) {
  req.logout()
  req.session.destroy()
  req.status(200).json({})
})

module.exports = router
