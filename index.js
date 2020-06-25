// https://www.sitepoint.com/discord-bot-node-js/
// https://discord.js.org/#/docs/main/v11/general/welcome

// discord bot set-up ----
require('dotenv').config()
const Discord = require('discord.js')
const bot = new Discord.Client()
bot.commands = new Discord.Collection()
const botCommands = require('./src/commands')
const TRIGGER = process.env.TRIGGER || '!'
Object.keys(botCommands).map(key => {
  bot.commands.set(TRIGGER + botCommands[key].name, botCommands[key])
})

bot.login(process.env.TOKEN)
// end of discord set-up ----

// express/mongoose/mongodb set-up ----
require('./src/db/mongoose')
const express = require('express')
const userRouter = require('./src/routers/users')
const fatRouter = require('./src/routers/fats')
const fatTrackingRouter = require('./src/routers/fattracking')
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(userRouter)
app.use(fatRouter)
app.use(fatTrackingRouter)
app.listen(port, () => {
    console.log('Server is up on port: ', port)
})
// end of express/mongoose/mongodb set-up ----

// discord bot ready ----
bot.on('ready', () => {
  console.log('Logged in as',  bot.user.tag)
})

// discord bot monitoring messages ----
bot.on('message', msg => {
  // making sure it doesn't reply to itself like an idiot
  if (msg.author === bot.user){
    return
  }

  // splitting up command as args using a space delimiter
  const args = msg.content.split(/ +/)
  // lowercasing the command to simplify the matching on list of bot commands
  const command = args.shift().toLowerCase()
  // if command not found in object array of commands return
  if (!bot.commands.has(command)){
    return
  }
  // if command is in object array, execute the execute key from the object array
  try {
    // console.log('Command running -', command)
    bot.commands.get(command).execute(msg, args)
  } catch (error) {
    console.error(error)
    msg.reply('there was an error trying to execute that command! Send this message to Raph if it continues to be a problem:')
    msg.reply(error)
  }
});
