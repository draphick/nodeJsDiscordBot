// https://www.sitepoint.com/discord-bot-node-js/
// https://discord.js.org/#/docs/main/v11/general/welcome

// express/mongoose/mongodb set-up ----
require('./src/db/mongoose')
const path = require('path')
const express = require('express')
const userRouter = require('./src/routers/users')
const fatRouter = require('./src/routers/fats')
const fatTrackingRouter = require('./src/routers/fattracking')
const app = express()
const port = process.env.PORT
const hbs = require('hbs')
const request = require('request')
app.use(express.json())
app.use(userRouter)
app.use(fatRouter)
app.use(fatTrackingRouter)
app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, '/templates/views'))
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, '/templates/partials'))

app.get('', (req, res) =>{
    res.render('index', {
        title: 'Probably',
        author: 'Raph'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Bah! 404!',
        errormessage: 'Page not found',
        author: 'Raph'
    })
})

app.listen(port, () => {
    console.log('Server is up on port: ', port)
})