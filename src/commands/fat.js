const Fat = require('../models/fat')
const discExpr = require('../middleware/discExpr')
const validator = require('validator')

module.exports = {
    name: 'fat',
    description: 'Fat stats bro!',
    execute(msg, args) {
        // const fullmsg = []
        // const discordUser = User.findOne({ discordId: msg.author.id })        
        console.log(msg.author.id + " --- discordID")
        const req = {}
        if (args[0] === 'join') {
            req.body = {
                "discordName": msg.author.username,
                "discordId": msg.author.id,
                "discordTag": msg.author.tag,
                "discordAvatarURL": msg.author.displayAvatarURL,
                "email": "none@none.com"
            }
                discExpr.createUser(req).then(() => {
                    msg.channel.send('You are all set up!')
                }).catch((error) => {
                    console.log(error)
                    msg.channel.send('You already have a profile set-up!')
                })
            return
        }
        if (args[0] === 'unjoin') {
            req.body = { "discordId":  msg.author.id }
            discExpr.delUser(req).then(() => {
                msg.channel.send('All dead.')
            }).catch((error) => {
                msg.channel.send('Nothing to unjoin.  Oh well.')
            })
            return
        }
        if (args[0] === 'info') {
            req.body = { "workoutUser":  msg.author.id }
            const newday = discExpr.debugAddDays(0)
            const todayis = newday.toISOString().split('T',1).toString()
            discExpr.getTodaysProgress(req, todayis).then((stats) => {

                fullmsg = 'Here are your currents stats: ```'
                stats.forEach((stat) => {
                    fullmsg += '\n' + stat['wo'] + '\n--' + stat['cur'] + '\\' + stat['go']
                })
                fullmsg += '```'
                msg.channel.send(fullmsg)
            }).catch((error) =>{

            })
            return
        }
        switch(true) {
            case (args[1] === undefined):
                msg.channel.send('Uhhh, I think you\'r missing something.  Try your command again.')
                break
            case (args[1] === 'add'):
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
            case (args[1] === 'remove'):
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
            case (args[1] === 'goal'):
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
            case (validator.isInt(args[1])):
                const newday = discExpr.debugAddDays(0)
                const todayis = newday.toISOString().split('T',1).toString()
                req.body = { 
                    "workoutUser":  msg.author.id,
                    "actions": {
                        fakename: args[1]
                    }
                }
                delete Object.assign(req.body.actions, {[args[0]]: req.body.actions['fakename'] })['fakename']
                discExpr.createTrackingEntry(req, todayis).then((entry) => {
                    totalleft = 88
                    goal = 22
                    fullmsg = 'Added ' + args[1] + ' to your ' + args[0] + ' goal! \n'
                    fullmsg += 'You still have ' + totalleft + ' more to do to hit your goal of ' + goal + '!!'
                    msg.channel.send(fullmsg)
                }).catch((error) => {
                    console.log(error)
                })
                break
            default:
                msg.channel.send('Option not available')
        }
    }
}

/*
EXAMPLES
_______
!fat squats add
  //adds 'squats' to your goals

!fat squats goal 200
  //edits 'squats' goal to be 200

!fat squats remove
  //removes 'squats' from your goal list

!fat squats 100
  //adds 100 to your current 'squats' goal
*/