const discExpr = require('../middleware/discExpr')

module.exports = {
    name: 'trackthis',
    description: 'tracking something you wanted to track',
    execute({channel,author}, stringargs) { 
        console.log(author.id + " --- discordUserID")
        console.log(author.username + " --- discordUser")
        console.log(stringargs + " --- args")
        const args = stringargs.split(/ +/)
        savethis = stringargs.replace(args[0] + ' ','')
        const req = {} 
        const datetime = discExpr.debugAddDays(0).split(', ')
        const todayis = datetime[0]
        const timeis = datetime[1]
        console.log(datetime)
        console.log(todayis)
        console.log(timeis)
        req.body = { 
            "discordId":  author.id,
            "what": {
                fakename: savethis
            }
        }
        // in req.body created above, replace the 'fakename' with the proper args[0] provided by user:
        delete Object.assign(req.body.what, {[timeis]: req.body.what['fakename'] })['fakename']
        try {
            discExpr.createTrackThisEntry(req, todayis).then((entry) => {
            console.log(entry)
        })} catch (error) {
            console.log(error)
        }
        channel.send('asdf')
    }
}