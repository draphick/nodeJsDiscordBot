const mongoose = require('mongoose')
const validator = require('validator')

const whatTrackingSchema = new mongoose.Schema({
    discordId: {
        type: Number,
        required: true,
        trim: true,
        ref: 'User'
    },    
    date: {
        type: String,
        required: true,
    },
    what: {
        type: Map,
        of: String
    }
})

const WhatTracking = mongoose.model('WhatTracking', whatTrackingSchema)

module.exports = WhatTracking