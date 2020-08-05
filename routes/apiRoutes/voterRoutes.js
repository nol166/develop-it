const express = require('express')
const router = express.Router()
const db = require('../../db/database')
const inputCheck = require('../../utils/inputCheck')

//* Voter endpoints

// GET all voters
router.get('/voters', (_req, res) => {
    const sql = `SELECT * FROM voters ORDER BY last_name`
    const params = []

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        res.json({
            message: 'Success!',
            data: rows,
        })
    })
})

// GET a specific voter
router.get('/voter/:id', (req, res) => {
    const sql = `SELECT * FROM voters WHERE id = ?`
    const params = [req.params.id]

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({
            message: 'Success!',
            data: row,
        })
    })
})

// POST to add a voter
router.post('/voter', ({ body }, res) => {
    //? if the user doesn't provide a first name, last name, or email
    const errors = inputCheck(body, 'first_name', 'last_name', 'email')
    if (errors) {
        res.status(400).json({
            error: errors,
        })
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?, ?, ?)`
    const params = [body.first_name, body.last_name, body.email]

    db.run(sql, params, function (err, data) {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({
            message: 'Success!',
            data: body,
            id: this.lastID,
        })
    })
})

// PUT route to update a user
router.put('/voter/:id', (req, res) => {
    //? if the user doesn't provide the right data
    const errors = inputCheck(req.body, 'email')
    if (errors) {
        res.status(400).json({ error: errors })
        return
    }

    const sql = `UPDATE voters SET email = ? WHERE id = ?`
    const params = [req.body.email, req.params.id]

    db.run(sql, params, function (err, _data) {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({
            message: 'Updated!',
            data: req.body,
            changes: this.changes,
        })
    })
})

// DELETE to remove a voter
router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`
    const params = [req.params.id]

    db.run(sql, params, function (err, _result) {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({
            message: 'Deleted user!',
            changes: this.changes,
        })
    })
})

module.exports = router
