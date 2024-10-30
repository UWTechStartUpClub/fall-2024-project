const { Pool } = require('pg')

const dbConfig = {
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5532,
}

const pool = new Pool(db)

module.exports = pool