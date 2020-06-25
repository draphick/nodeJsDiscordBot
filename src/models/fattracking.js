const mongoose = require('mongoose')
const validator = require('validator')
const User = require('../models/user')


const fatTrackingSchema = new mongoose.Schema({
    workoutUser: {
        type: String,
        required: true,
        trim: true,
        ref: 'User'
    },    
    date: {
        type: String,
        required: true,
    },
    actions: {
        type: Map,
        of: String
    }
})

const FatTracking = mongoose.model('FatTracking', fatTrackingSchema)

module.exports = FatTracking