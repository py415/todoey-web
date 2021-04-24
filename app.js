// Setup dependencies
const express = require('express')
const app = express()
const port = 3000

// GET home route
app.get('/', (req, res) => {
    res.send('Server is up and running.')
})

// Listen for app on localhost port
app.listen(port, () => {
    console.log('Server is running on port ', port)
})