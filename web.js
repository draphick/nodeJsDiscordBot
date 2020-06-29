// https://www.sitepoint.com/discord-bot-node-js/
// https://discord.js.org/#/docs/main/v11/general/welcome

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
