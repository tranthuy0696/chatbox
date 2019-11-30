const express = require('express')
const router = new express.Router()
const {addUser} = require('./handler')

router.post('/', (req, res, next) => {
    return addUser(req.body)
        .then((user) => {
            res.status(200).json(user)
        }).catch((err) => {
            res.status(400).json(err)
        })
})

module.exports = router
