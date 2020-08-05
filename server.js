// express config
const express = require('express')
const db = require('./db/database')
const PORT = process.env.port || 3001
const app = express()

const inputCheck = require('./utils/inputCheck')
const apiRoutes = require('./routes/apiRoutes')

// express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/api', apiRoutes)

// fallback for non-existant endpoint
app.use((req, res) => {
    res.send('Invalid connection')
    res.status(400).end()
})

// listen wrapped in an event handler so that the server doesn't start until the DB is connected
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})
