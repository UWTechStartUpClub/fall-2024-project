const express = require('express')
const { register, login } = require('../controllers/auth')

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        console.log("(register) Username:", username, "Email:", email, "Password:", password)

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        await register(username, email, password)
        res.status(201).send('User registered successfully')
    } catch (error) {
        if (error.message === 'Username or email already exists') {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body
        console.log("(login) Username:", username, "Email:", email, "Password:", password)

        if (!username || !email || !password) {
            throw new Error("Username, email, and password are required");
        }

        const token = await login(username, email, password)
        res.json({ token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router