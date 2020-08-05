// express config
const express = require('express')
const PORT = process.env.port || 3001
const app = express()
const sqlite3 = require('sqlite3').verbose()

const inputCheck = require('./utils/inputCheck')

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
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`
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
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id 
    WHERE candidates.id = ?`
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

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(
        body,
        'first_name',
        'last_name',
        'industry_connected'
    )
    if (errors) {
        res.status(400).json({ error: errors })
        return
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`
    const params = [body.first_name, body.last_name, body.industry_connected]
    db.run(sql, params, function (err, _result) {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        res.json({
            message: 'success',
            data: body,
            id: this.lastID,
        })
    })
})

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

// post pandemic dating (tyler Barry, Victor Lopez, Shane McFadden)
// Bored at Home (Tom Brazier, Joe Flanagan, Claudia, Alavaro)
// call it a night (Chris Concannon, Ryanne, Joe Ramos)
// pet-tinder ( Nicolas Esquivel Ruiz,  Jack Hoover)
// barkeep (Jessica, Matt Linden, Brandon Mcguire, Justin Oldmixon)
