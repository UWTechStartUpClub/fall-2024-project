const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const JWT_SECRET = process.env.JWT_SECRET

const register = async (username, email, password) => {
    // username or email already exist
    const exists = await pool.query(
        `SELECT * FROM users WHERE username = $1 OR email = $2`,
        [username, email]
    )
    if (exists.rows.length > 0) {
        throw new Error("Username or email already exists")
    }

    // else new username and email
    const hashedPassword = await bcrypt.hash(password, 10)
    await pool.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
        [username, email, hashedPassword]
    )
}

const login = async (email, password) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    )

    if (result.rows.length === 0) {
        throw new Error("User not found")
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new Error("Invalid password")
    }

    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30m' })
}

module.exports = { register, login }