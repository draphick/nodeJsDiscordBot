const express = require('express')
const router = new express.Router()
const FatTracking = require('../models/fattracking')
const isUser = require('../middleware/isuser')
const discExpr = require('../middleware/discExpr')

router.post('/api/v1/tracking', isUser, async (req, res) => {
    // const newday = await discExpr.debugAddDays(0)
    const todayis = discExpr.debugAddDays(0).split(',',1).toString()
    try {
        const trackingEntry = await discExpr.createTrackingEntry(req, todayis)
        if (!trackingEntry){
            res.status(404).send('Workout not found, add entry to your goal first.')
        }
        res.status(200).send(trackingEntry)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

router.post('/api/v1/tracking', isUser, async (req, res) => {
    // const newday = await discExpr.debugAddDays(0)
    const todayis = discExpr.debugAddDays(0).split(',',1).toString()
    try {
        const trackingEntry = await discExpr.getTrackingEntry(req, todayis)
        res.status(200).send(trackingEntry)
    } catch (error) {
            res.status(200).send(trackingEntry)
    }
})

router.get('/api/v1/todaysprogress', isUser, async (req, res) => {
    // const newday = await discExpr.debugAddDays(0)
    const todayis = discExpr.debugAddDays(0).split(',',1).toString()
    try {
        const trackingEntry = await discExpr.getTodaysProgress(req, todayis)
        res.status(200).send(trackingEntry)
    } catch (error) {
            res.status(200).send(trackingEntry)
    }
})

module.exports = router
