const express = require('express')
const router = new express.Router()

router.use('/user', require('../user').router)
module.exports = { router }
