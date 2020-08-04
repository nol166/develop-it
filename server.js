// express config
const express = require('express')
const PORT = process.env.port || 3001
const app = express()
const sqlite3 = require('sqlite3').verbose()

// express middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// connect to sqlite3
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message)
    }
    console.info('Connected to the election database')
})

// GET all candidates
app.get('/api/candidates', (_req, res) => {
    const sql = `SELECT * FROM candidates`
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        res.json({ message: 'Success', data: rows })
    })
})

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        res.json({ message: 'success', data: row })
    })
})

// DELETE a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`
    const params = [req.params.id]
    db.run(sql, params, function (err, _result) {
        if (err) {
            res.status(400).json({ error: res.message })
            return
        }

        res.json({
            message: 'successfully deleted',
            changes: this.changes,
        })
    })
})

// CREATE a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?, ?, ?, ?)`
// const params = [1, 'Ronald', 'Firebank', 1]
// db.run(sql, params, function (err, result) {
//     err
//         ? console.error(err)
//         : console.info('Added candidate', result, this.lastID)
// })

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
