const express = require('express')
const router = new express.Router()
const isUser = require('../middleware/isuser')
const discExpr = require('../middleware/discExpr')

router.post('/api/v1/workouts', isUser, async (req, res) => {
    try {
        const fat = await discExpr.createWorkout(req)
        if (!fat){
            res.status(201).send('Workout already exists')
            return
        }
        res.status(201).send(fat)
    } catch (error) {
        res.status(500).send("error" + error)
    }
})

router.get('/api/v1/workouts', isUser, async (req, res) => {
    try {
        const fat = await discExpr.getWorkoutsForUser(req)
        if (!fat){
            res.status(200).send("No workouts found for user")
            return
        }
        res.status(200).send(fat)
    } catch (error) {
        console.log(error)
        res.status(500).send("error" + error)
    }
})

router.delete('/api/v1/workouts/remove', isUser, async (req, res) => {
    try {
        const fat = await discExpr.delWorkout(req)
        if(!fat){            
            res.status(200).send('No workout found by that name')
            return
        }
        res.status(200).send('Workout deleted')
    } catch (error) {
        console.log(error)
        res.status(500).send("error" + error)

    }
})

module.exports = router
