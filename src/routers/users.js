const express = require('express')
const router = new express.Router()
const isUser = require('../middleware/isuser')
const discExpr = require('../middleware/discExpr')

router.post('/api/v1/user/create', async (req, res) => {
    try {
        const user = await discExpr.createUser(req)
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send("Something went wrong\n" + error)
    }
})

router.get(('/api/v1/user/me'), isUser, async (req,res) => {
    try {
        const user = await discExpr.getUser(req)
        res.status(200).send({user})
    } catch (error) {
        res.status(400).send('error')
    }
})

router.delete(('/api/v1/user/remove'), isUser, async (req,res) => {
    try {
        const user = await discExpr.delUser(req)
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router
