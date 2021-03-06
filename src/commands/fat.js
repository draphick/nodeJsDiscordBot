const discExpr = require('../middleware/discExpr')
const validator = require('validator')
const TRIGGER = process.env.TRIGGER || '!'


module.exports = {
    name: 'fat',
    description: 'Fat stats bro!',
    execute({channel,author}, stringargs) {  
        const args = stringargs.split(/ +/)
        args.shift()
        // const args = argsall.split(',') 
        console.log(author.id + " --- discordUserID")
        console.log(author.username + " --- discordUser")
        console.log(args + " --- args")
        const req = {}
        check = {
            body: {
                "discordId":  author.id
            }
        }        
        discExpr.getUser(check).then((res) => {
            if (!res){
                if (args[0] != 'join') {
                    channel.send('You are not a user, please use `'  + TRIGGER + 'fat join` to join the party!')
                    return false
                }
            }
            return true
        }).then((isUserAvlive) => {            
            if (args[0] === 'join') {
                req.body = {
                    "discordName": author.username,
                    "discordId": author.id,
                    "discordTag": author.tag,
                    "discordAvatarURL": author.displayAvatarURL,
                    "email": "none@none.com"
                }
                    discExpr.createUser(req).then((res) => {
                        channel.send('You are all set up!')
                    }).catch((error) => {
                        console.log(error)
                        channel.send('You already have a profile set-up!')
                    })
                return
            }
            if (args[0] === 'unjoin') {
                req.body = { "discordId":  author.id }
                discExpr.delUser(req).then((res) => {
                    if (res){
                        channel.send('All dead.')
                        return
                    }
                    channel.send('Nothing to unjoin.  Oh well.')
                }).catch((error) => {
                    console.log(error)
                })
                return
            }
            if (args[0] === 'info' && isUserAvlive) {
                req.body = { "workoutUser":  author.id }
                // const newday = discExpr.debugAddDays(0)
                const todayis = discExpr.debugAddDays(0).split(',',1).toString()
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
                    channel.send(fullmsg)
                }).catch((error) =>{
                    channel.send('You have nothing to track.  See `'  + TRIGGER + 'fat` for your options.')
                })
                return
            }
            if (!args[1]){
                args[1] = 'None'
            }
            switch(true) {
                case (args[1] === 'add' && isUserAvlive):
                    req.body = { 
                        "workoutUser":  author.id,
                        "trackingName": args[0]
                    }
                    discExpr.createWorkout(req).then((workout) => {
                        if (!workout) {
                            channel.send('This workout already exists.')
                            return
                        }
                        channel.send('I have added ' + args[0] + ' to your routine with a goal of 100!  GLHF! ')
                    }).catch((error) => {
                        console.log(error)
                    })
                    break
                case (args[1] === 'remove' && isUserAvlive):
                    req.body = { 
                        "workoutUser":  author.id,
                        "trackingName": args[0]
                    }
                    discExpr.delWorkout(req).then((workout) => {
                        if (!workout) {
                            channel.send('Workout not found! Try again.')
                            return
                        }
                        channel.send('Workout deleted: **' + args[0] + '** \nBye-bye gainz!')
                    }).catch((error) => {
                        console.log(error)
                    })
                    break
                case (args[1] === 'goal' && isUserAvlive):
                    req.body = { 
                        "workoutUser":  author.id,
                        "trackingName": args[0],
                        "newGoal": args[2]
                    }
                    discExpr.updateWorkoutsForUser(req).then((workout) => {
                        if (!workout){
                            channel.send('You don\'t have a workout by this name.')
                            return
                        }
                        channel.send('Your ' + args[0] + ' goal has been updated to ' + args[2] + '! :D')
                    }).catch((error) => {
                        console.log(error)
                    })
                    break                
                case (validator.isInt(args[1]) && isUserAvlive):
                    // const newday = discExpr.debugAddDays(0)
                    const todayis = discExpr.debugAddDays(0).split(',',1).toString()
                    req.body = { 
                        "workoutUser":  author.id,
                        "actions": {
                            fakename: args[1]
                        }
                    }
                    // in req.body created above, replace the 'fakename' with the proper args[0] provided by user:
                    delete Object.assign(req.body.actions, {[args[0]]: req.body.actions['fakename'] })['fakename']
                    discExpr.createTrackingEntry(req, todayis).then((entry) => {
                        if (!entry){
                            channel.send('Workout not found. \nAdd your `' + args[0] + '` goal first running the command `' + TRIGGER + 'fat ' + args[0] + ' add`')
                            return
                        }
                        return entry}).then((entry) => {
                            discExpr.getTodaysProgressSingle(req,todayis,args[0]).then((todaysProgross) => {
                                const totalleft = todaysProgross['re']
                                const goal = todaysProgross['go']
                                const current = entry.actions.get(args[0])
                                console.log(current, goal, totalleft)
                                fullmsg = 'I\'ve added ' + args[1] + ' to your ' + args[0] + ' goal. \n'
                                if ('weight' === args[0]){
                                    if (totalleft >= 0){
                                        fullmsg += 'You\'ve reached your fat goal! Great job! \n'
                                        fullmsg += 'You\'re currently at ' + current + ' pounds.'
                                    } else {
                                        fullmsg += 'You are at ' + current + ' total with only ' + totalleft * -1 + ' more to do to hit your goal of ' + goal + '!!'
                                    }
                                } else {
                                    if (totalleft <= 0){
                                        fullmsg += 'You\'ve reached your goal! Great job! \n'
                                        fullmsg += 'You\'re currently at ' + current + ' of ' + goal + '.'
                                    } else {
                                        fullmsg += 'You are at ' + current + ' total with ' + totalleft + ' more to do to hit your goal of ' + goal + '!!'
                                    }
                                }
                                
                                fullmsg += '\nUse `'  + TRIGGER + 'fat info` for more details on all your goals.'
                                channel.send(fullmsg)
                            }).catch ((error) => {
                            console.log(error)
                        })}).catch((error) => {
                            console.log(error)
                    })
                    break
                default:
                    if (isUserAvlive){
                        fullmsg = 'Need some help?  See below:\n\
    ```\nEXAMPLES\n\
    _______\n\
    '  + TRIGGER + 'fat join\n\
    // Join the fat craze!\n\
    '  + TRIGGER + 'fat unjoin\n\
    // Leave the fat craze. :(\n\
    '  + TRIGGER + 'fat squats add\n\
    //adds \'squats\' to your goals\n\
    '  + TRIGGER + 'fat squats goal 200\n\
    //edits \'squats\' goal to be 200\n\
    '  + TRIGGER + 'fat squats remove\n\
    //removes \'squats\' from your goal list\n\
    '  + TRIGGER + 'fat squats 100\n\
    //adds 100 to your current \'squats\' tracking for today\n\
    '  + TRIGGER + 'fat info\n\
    //Gives you your current stats for today```'
                        channel.send(fullmsg)
                        return
                    }
            }
        })
    }
}