const User = require('../models/user')
const Fat = require('../models/fat')
const FatTracking = require('../models/fattracking')


const debugAddDays = () => {
    days = 0
    const olddate = new Date()
    const copy = new Date(Number(olddate))
    copy.setDate(olddate.getDate() + days)
    console.log('todays date')
    console.log(copy)
    return copy.toLocaleString('en-US', {timeZone: "America/Los_Angeles"}).split(',',1).toString()
}

const createUser = async (req) => {
    try {
        const user = new User(req.body)
        await user.save()
        return user
    } catch (error) {
        throw new Error(error)
    }
}

const getUser = async (req) => {
    const user = await User.findOne({ discordId: req.body.discordId})
    if(!user){
        return false
    }
    return user
}

const delUser = async (req) => {
    const user = await User.findOne({ discordId: req.body.discordId})
    if (!user){
        return false
    }
    user.remove()
    return true
}

const createWorkout = async (req) => {
    const fat = new Fat({
        ...req.body,
    })
    const workout = await Fat.findOne({ workoutUser: req.body.workoutUser, trackingName: req.body.trackingName })
    if (workout){
        return false
    }
    await fat.save()
    return fat
}

const getWorkoutsForUser = async (req) => {
    const fat = await Fat.find({ workoutUser: req.body.workoutUser})
    if (fat.length > 0) {
        return fat
    }
    return false
}

const updateWorkoutsForUser = async (req) => {
    const workout = await Fat.findOne({ workoutUser: req.body.workoutUser, trackingName: req.body.trackingName})
    if (!workout){
        return false
    }
    workout['goal'] = req.body.newGoal
    workout.save()
    return workout
}

const delWorkout = async (req) => {
    const fat = await Fat.findOne({ workoutUser: req.body.workoutUser, trackingName: req.body.trackingName}) || {}
    if (fat.trackingName){
        fat.remove()
        return true
    }
    return false
}

const createTrackingEntry = async (req,todayis) => {
    const actionName = Object.keys(req.body.actions)[0]
    const actionValue = Object.values(req.body.actions)[0]
    const workouts = await getWorkoutsForUser(req)
    if (!workouts){
        return false
    }
    workoutExistsCheck = workouts.find((workoutname) => workoutname.trackingName === actionName)
    if (!workoutExistsCheck){
        return false
    }
    const currentTracking = await FatTracking.findOne({ 
        workoutUser: req.body.workoutUser,
        date: todayis
    })
    if (!currentTracking){
        const track = new FatTracking({
            ...req.body,
            date: todayis
        })
        await track.save()
        return track
    }

    if (currentTracking.get('actions').has(actionName)){
        const actionValueOld = currentTracking.actions.get(actionName)
        const actionValueNew = parseInt(actionValueOld, 10) + parseInt(actionValue, 10)
        currentTracking.actions.set(actionName, actionValueNew)
        currentTracking.save()
        return currentTracking
    }
    if (!currentTracking.get('actions').has(actionName)){
        currentTracking.actions.set(actionName, actionValue)
        currentTracking.save()
        return currentTracking
    }
}

const getTrackingEntry = async (req, todayis) => {
    const currentTracking = await FatTracking.findOne({ 
        workoutUser: req.body.workoutUser,
        date: todayis
    })
    if (!currentTracking){
        return 'No enteries for ' + todayis
    }
    return currentTracking
}

const getTodaysProgress = async (req,todayis) => {
    const workouts = await getWorkoutsForUser(req)
    const todaysProgress = await getTrackingEntry(req,todayis)
    const wocurrego = []
    workouts.forEach((workout) => {
        const wo = workout['trackingName']
        try{
            cur = todaysProgress.actions.get(wo) || 0
        } catch (error) {
            cur = 0
        }
        const go = workout['goal']
        const re = go - cur
        wocurrego.push({wo, cur, re, go})
    })
    if (!wocurrego) {
        return false
    }
    return wocurrego
}

const getTodaysProgressSingle = async (req,todayis,actionName) => {
    const workouts = await getWorkoutsForUser(req)
    const todaysProgress = await getTrackingEntry(req,todayis)
    const wocurrego = []
    workouts.forEach((workout) => {
        const wo = workout['trackingName']
        const cur = todaysProgress.actions.get(wo) || 0
        const go = workout['goal']
        const re = go - cur
        wocurrego.push({wo, cur, re, go})
    })
    const currentWorkoutRequest = wocurrego.find((workoutname) => workoutname.wo === actionName)
    if (!currentWorkoutRequest){
        return false
    }
    return currentWorkoutRequest
}

module.exports = {
    createUser: createUser,
    getUser: getUser,
    delUser: delUser,
    getWorkoutsForUser: getWorkoutsForUser,
    createWorkout: createWorkout,
    delWorkout: delWorkout,
    debugAddDays: debugAddDays,
    createTrackingEntry:createTrackingEntry,
    getTrackingEntry: getTrackingEntry,
    updateWorkoutsForUser: updateWorkoutsForUser,
    getTodaysProgress: getTodaysProgress,
    getTodaysProgressSingle: getTodaysProgressSingle
}