// Setup dependencies
const express = require('express')
const app = express()
const port = 3000

let items = []
let workItems = []

// Set view engine to EJS
app.set('view engine', 'ejs')

app.use(express.static('public'))
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
    res.render('pages/list', {listTitle: day, newListItems: items})
})

// POST home route
app.post('/', (req, res) => {
    // Fetch newItem from text input field
    let item = req.body.newItem

    if (req.body.list === 'Work') {
        workItems.push(item)
        res.redirect('/work')
    } else {
        items.push(item)
        res.redirect('/')
    }
})

// GET work route
app.get('/work', (req, res) => {
    res.render('pages/list', {listTitle: 'Work', newListItems: workItems})
})

// Listen for app on localhost port
app.listen(port, () => {
    console.log('Server is running on port ', port)
})