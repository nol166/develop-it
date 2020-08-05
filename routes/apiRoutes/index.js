const express = require('express')
const router = express.Router()

/*
This file will act as a index for all other sets of routes
We use the 'router.use' method and import them directly with
a require statement
*/

//TODO: Comment these back in
router.use(require('./candidateRoutes'))
router.use(require('./voterRoutes'))
router.use(require('./partyRoutes'))
router.use(require('./voteRoutes'))

module.exports = router
