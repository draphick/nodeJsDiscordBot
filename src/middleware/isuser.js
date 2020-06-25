const User = require('../models/user')

const isUser = async (req, res, next) => {
    try {
        passedId = req.body.discordId || req.body.workoutUser
        const user = await User.findOne({ discordId: passedId})
        if (!user) {
            throw new Error()
        }
        req.isUser = user
        next()
    } catch (error) {
        res.status(401).send({ error: 'You must be signed in' })
    }
}

module.exports = isUser