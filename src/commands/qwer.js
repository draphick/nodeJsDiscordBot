const discExpr = require('../middleware/discExpr')

module.exports = {
    name: 'ff',
    description: 'ff',
    execute(msg, args) {
        req = {}
        req.body = {
            "discordId": "123123"
        }
        discExpr.delUser(req)
        msg.channel.send('Ping Arguments sent: ' + args)
    }
}