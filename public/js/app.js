const discordForm = document.querySelector('form')
const search = document.querySelector('input')
const message1 = document.querySelector('#message1')
const message2 = document.querySelector('#message2')


console.log('loading app.js')

discordForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log('here')
    const location = search.value
    message1.textContent = 'Loading'
    message2.textContent = ''
    // const todayis = discExpr.debugAddDays(0).split(',',1).toString()
    // try {
    //     req = {}
    //     req.body = { "workoutUser":  253425146738638849 }
    //     discExpr.getTodaysProgress(req, todayis).then((trackingEntry) => {
    //         if (trackingEntry){
    //             message1.textContent = trackingEntry
    //         } else {
    //             message1.textContent = req.body
    //         }
    //         console.log(trackingEntry)
    //         res.status(200).send(trackingEntry)
    //     })
        
    // } catch (error) {
    //         res.status(200).send(trackingEntry)
    // }
    fetch('/api/v1/tracking',{method: 'POST', body: {"workoutUser":  253425146738638849} }).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                message1.textContent = data.error
            } else {
                message1.textContent = data.location
                message2.textContent = data.forecast
            }
        })
    })
    // fetch('/weather?address=' + location).then((response) => {
    //     response.json().then((data) => {
    //         if (data.error) {
    //             message1.textContent = data.error
    //         } else {
    //             message1.textContent = data.location
    //             message2.textContent = data.forecast
    //         }
    //     })
    // })
})