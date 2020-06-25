const Fat = require('../models/fat')
const discExpr = require('../middleware/discExpr')
const validator = require('validator')
const TRIGGER = process.env.TRIGGER || '!'


module.exports = {
    name: 'fat',
    description: 'Fat stats bro!',
    execute(msg, args) {   
        console.log(msg.author.id + " --- discordID")
        const req = {}
        check = {
            body: {
                "discordId":  msg.author.id
            }
        }        
        discExpr.getUser(check).then((res) => {
            if (!res){
                msg.channel.send('You are not a user, please use `!fat join` to join the party!')
                return false
            }
            return true
        }).then((isUserAvlive) => {
            console.log(isUserAvlive)
            
            if (args[0] === 'join') {
                req.body = {
                    "discordName": msg.author.username,
                    "discordId": msg.author.id,
                    "discordTag": msg.author.tag,
                    "discordAvatarURL": msg.author.displayAvatarURL,
                    "email": "none@none.com"
                }
                    discExpr.createUser(req).then((res) => {
                        msg.channel.send('You are all set up!')
                    }).catch((error) => {
                        console.log(error)
                        msg.channel.send('You already have a profile set-up!')
                    })
                return
            }
            if (args[0] === 'unjoin') {
                req.body = { "discordId":  msg.author.id }
                discExpr.delUser(req).then((res) => {
                    if (res){
                        msg.channel.send('All dead.')
                        return
                    }
                    msg.channel.send('Nothing to unjoin.  Oh well.')
                }).catch((error) => {
                    console.log(error)
                })
                return
            }
            if (args[0] === 'info' && isUserAvlive) {
                req.body = { "workoutUser":  msg.author.id }
                const newday = discExpr.debugAddDays(0)
                const todayis = newday.toISOString().split('T',1).toString()
                discExpr.getTodaysProgress(req, todayis).then((stats) => {
                    fullmsg = 'Here are your currents stats: ```\n'
                    stats.forEach((stat) => {
                        
                        wolength = stat['wo'].length
                        curgoaltotals = stat['cur'] + '/' + stat['go']
                        curgoaltotalslength = 30 - wolength - curgoaltotals.length
                        fullmsg += stat['wo']
                        while (curgoaltotalslength--) {
                            fullmsg += '_'
                        }
                        fullmsg += curgoaltotals + '\n'
                        
                    })
                    fullmsg += '```'
                    msg.channel.send(fullmsg)
                }).catch((error) =>{
                    msg.channel.send('You have nothing to track.  See `!fat` for your options.')
                })
                return
            }
            if (!args[1]){
                args[1] = 'None'
            }
            switch(true) {
                case (args[1] === 'add' && isUserAvlive):
                    req.body = { 
                        "workoutUser":  msg.author.id,
                        "trackingName": args[0]
                    }
                    discExpr.createWorkout(req).then((workout) => {
                        if (!workout) {
                            msg.channel.send('This workout already exists.')
                            return
                        }
                        msg.channel.send('I have added ' + args[0] + ' to your routine with a goal of 100!  GLHF! ')
                    }).catch((error) => {
                        console.log(error)
                    })
                    break
                case (args[1] === 'remove' && isUserAvlive):
                    req.body = { 
                        "workoutUser":  msg.author.id,
                        "trackingName": args[0]
                    }
                    discExpr.delWorkout(req).then((workout) => {
                        if (!workout) {
                            msg.channel.send('Workout not found! Try again.')
                            return
                        }
                        msg.channel.send('Workout deleted: **' + args[0] + '** \nBye-bye gainz!')
                    }).catch((error) => {
                        console.log(error)
                    })
                    break
                case (args[1] === 'goal' && isUserAvlive):
                    req.body = { 
                        "workoutUser":  msg.author.id,
                        "trackingName": args[0],
                        "newGoal": args[2]
                    }
                    discExpr.updateWorkoutsForUser(req).then((workout) => {
                        if (!workout){
                            msg.channel.send('You don\'t have a workout by this name.')
                            return
                        }
                        msg.channel.send('Your ' + args[0] + ' goal has been updated to ' + args[2] + '! :D')
                    }).catch((error) => {
                        console.log(error)
                    })
                    break                
                case (validator.isInt(args[1]) && isUserAvlive):
                    const newday = discExpr.debugAddDays(0)
                    const todayis = newday.toISOString().split('T',1).toString()
                    req.body = { 
                        "workoutUser":  msg.author.id,
                        "actions": {
                            fakename: args[1]
                        }
                    }
                    // in req.body created above, replace the 'fakename' with the proper args[0] provided by user:
                    delete Object.assign(req.body.actions, {[args[0]]: req.body.actions['fakename'] })['fakename']
                    discExpr.createTrackingEntry(req, todayis).then((entry) => {
                        if (!entry){
                            msg.channel.send('Workout not found. \nAdd your `' + args[0] + '` goal first running the command `' + TRIGGER + 'fat ' + args[0] + ' add`')
                            return
                        }
                        return discExpr.getTodaysProgressSingle(req,todayis,args[0])
                    }).then((todaysProgross) => {
                        const totalleft = todaysProgross['re']
                        const goal = todaysProgross['go']
                        const current = todaysProgross['cur']
                        fullmsg = 'Added ' + args[1] + ' to your ' + args[0] + ' goal! \n'
                        fullmsg += 'You are at ' + current + ' total with ' + totalleft + ' more to do to hit your goal of ' + goal + '!!'
                        fullmsg += '\nUse `!fat info` for more details on all your goals.'
                        msg.channel.send(fullmsg)
                    }).catch((error) => {
                        console.log(error)
                    })
                    break
                default:
                    if (isUserAvlive){
                        fullmsg = 'Need some help?  See below:\n\
    ```\nEXAMPLES\n\
    _______\n\
    !fat join\n\
    // Join the fat craze!\n\
    !fat unjoin\n\
    // Leave the fat craze. :(\n\
    !fat squats add\n\
    //adds \'squats\' to your goals\n\
    !fat squats goal 200\n\
    //edits \'squats\' goal to be 200\n\
    !fat squats remove\n\
    //removes \'squats\' from your goal list\n\
    !fat squats 100\n\
    //adds 100 to your current \'squats\' tracking for today\n\
    !fat info\n\
    //Gives you your current stats for today```'
                        msg.channel.send(fullmsg)
                        return
                    }
            }
        })
    }
}