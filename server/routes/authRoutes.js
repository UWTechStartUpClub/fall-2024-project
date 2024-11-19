const express = require('express');
const { register, login, refreshTokens } = require('../controllers/auth');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" })
        }

        await register(username, email, password);
        res.status(201).send('User registered successfully');
    } catch (error) {
        if (error.message === 'Username or email already exists') {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const { accessToken, refreshToken } = await login(email, password);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // secure: /* process.env for production environment */,
            sameSite: 'strict',
            maxAge: 30 * 60 * 1000 // 30 min in ms
        });

        res.cookie('refeshToken', refreshToken, {
            httpOnly: true,
            // secure: /* process.env for production environment */,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
        });

        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: "Logged out successfully" });
});

router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const newAccessToken = await refreshTokens(refreshToken);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            // secure: /* process.env for production environment */,
            sameSite: 'strict',
            maxAge: 30 * 60 * 1000 // 30 min in ms
        });

        res.json({ message: "Token refreshed successfully" })
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired refresh token" })
    }
});

router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: "Profile accessed successfully", user: req.user });
});

module.exports = router;