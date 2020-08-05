const express = require('express')
const router = express.Router()
const db = require('../../db/database')

//* PARTY ROUTES

// GET all parties
router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM PARTIES`
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

// GET a single party
router.get('/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`
    const params = [req.params.id] //? array for multiple ids
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({
                error: err.message,
            })
            return
        }

        res.json({
            message: 'success!',
            data: row,
        })
    })
})

// DELETE a party
router.delete('/party/:id', function (req, res) {
    const sql = `DELETE FROM parties WHERE id = ?`
    const params = [req.params.id]
    db.run(sql, params, (err, data) => {
        if (err) {
            res.status(400).json({
                error: err.message,
            })
            return
        }

        res.json({
            message: 'Deleted!',
            changes: this.changes,
        })
    })
})

module.exports = router
