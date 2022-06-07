const express = require('express')
const router = express.Router()

// define the home page route
router.get('/login', (req, res) => {
    res.send('Birds home page')
})
// define the about route
router.get('/signup', (req, res) => {
    res.send('About birds')
})
router.get('/', (req, res) => {
    res.send('About ssssbirds')
})
module.exports = router

router.use("/123",)