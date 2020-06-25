const mongoose = require('mongoose')
const validator = require('validator')
const Fat = require('./fat')
const FatTracking = require('../models/fattracking')
const userSchema = new mongoose.Schema({
    discordId: {
        type: Number,
        unique: true,
        required: true
    },
    discordName: {
        type: String,
        required: true,
        trim: true
    },
    discordTag: {
        type: String,
        required: true,
        trim: true
    },
    discordAvatarURL: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if (!validator.isURL(value)){
                throw new Error('URL is invalid.')
            }
        }
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        default: 'noemailprovided@noone.com',
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid.')
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            required: false
        }
    }]
})

userSchema.virtual('workoutUserTracking', {
    ref: 'Fat',
    localField: 'discordId',
    foreignField: 'workoutUser'
})

// Delete user exercises when user is deleted
userSchema.pre('remove', async function (next) {
    const user = this 
    await Fat.deleteMany({ workoutUser: user.discordId })
    await FatTracking.deleteMany({ workoutUser: user.discordId })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User