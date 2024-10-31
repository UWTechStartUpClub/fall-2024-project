const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const JWT_SECRET = process.env.JWT_SECRET

const register = async(username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("here")
    await pool.query(`INSERT INTO users ( username, password )
        VALUES ($1, $2)`, [username, hashedPassword])
}

const login = async(username, password) => {

}
  
module.exports = { register, login }