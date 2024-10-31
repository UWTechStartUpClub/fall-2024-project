const express = require('express')
const { register, login } = require('../controllers/auth')

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        // const { username, password } = req.body
        // console.log(req.body); 
        console.log(req.body.username) 
        console.log("Request Body: ", req.body, "Username: ", username, "Password: ", password)
        await register(req.body.username, req.body.password)
        res.status(201).send('User registered successfully')
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/login', async (req, res) => {

})

module.exports = router