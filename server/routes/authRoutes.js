const express = require('express')
const { register, login, authenticateToken } = require('../controllers/auth')

const router = express.Router()

router.post('/register', async (req, res) => {

})

router.post('/login', async (req, res) => {

})

router.get('/protected', authenticateToken, (req, res) => {

})

module.exports = router