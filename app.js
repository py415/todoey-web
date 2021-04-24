// Setup dependencies
const express = require('express')
const app = express()
const port = 3000

let items = []

// Set view engine to EJS
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))

// GET home route
app.get('/', (req, res) => {
    // Find todays date
    let today = new Date()
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    let day = today.toLocaleDateString('en-US', options)

    // Render todays date
    res.render('pages/list', {kindOfDay: day, newListItems: items})
})

// POST home route
app.post('/', (req, res) => {
    // Fetch newItem from text input field
    let item = req.body.newItem

    items.push(item)

    // Redirect page back to home route upon post request
    res.redirect('/')
})

// Listen for app on localhost port
app.listen(port, () => {
    console.log('Server is running on port ', port)
})