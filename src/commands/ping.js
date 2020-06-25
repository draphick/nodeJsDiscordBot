module.exports = {
    name: 'ping',
    description: 'Testing a Ping!',
    execute(msg, args) {
        msg.channel.send('Ping Arguments sent: ' + args)
    }
}