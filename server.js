// express config
const express = require('express')
const PORT = process.env.port || 3001
const app = express()

// express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// fallback for non-existant endpoint
app.use((req, res) => {
    res.send('Invalid connection')
    res.status(400).end()
})

// listen
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
