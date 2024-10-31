const path = require('path')
require('dotenv').config('.env')
const { Pool } = require('pg')

const db = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

const pool = new Pool(db)

module.exports = { pool }