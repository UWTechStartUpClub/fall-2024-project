const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const register = async (username, email, password) => {
    const exists = await pool.query(
        `SELECT * FROM users WHERE username = $1 OR email = $2`,
        [username, email]
    );
    if (exists.rows.length > 0) {
        throw new Error("Username or email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
        `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`,
        [username, email, hashedPassword]
    );
};

const login = async (email, password) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found")
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password")
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    // debugging
    console.log("accessToken: ", accessToken);
    console.log("refreshToken: ", refreshToken);

    await pool.query(
        `UPDATE users SET refresh_token = $1 WHERE id = $2`,
        [refreshToken, user.id]
    );

    return { accessToken, refreshToken };
};

const refreshTokens = async (refreshToken) => {
    if (!refreshToken) throw new Error("Refresh token is required");

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const result = await pool.query(
            `SELECT * FROM users WHERE id = $1 AND refresh_token = $2`,
            [decoded.userId, refreshToken]
        );

        if (result.rows.length === 0) throw new Error("Invalid refresh token");

        const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: '30m' });
        return accessToken;
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
}

module.exports = { register, login, refreshTokens };