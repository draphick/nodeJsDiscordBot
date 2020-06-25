const mongoose = require('mongoose')
const validator = require('validator')

const Fat = mongoose.model('Fat', {
    workoutUser: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: true,
        trim: true,
        ref: 'User'
    },    
    trackingName: {
        type: String,
        required: true,
        trim: true
    },
    trackingType: {
        type: String,
        required: false,
        default: 'exercise'
    },
    goal: {
        type: Number,
        required: false,
        default: 100
    }
})

module.exports = Fat