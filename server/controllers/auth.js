const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

const JWT_SECRET = process.env.JWT_SECRET;

const register = async(username, password) => {

};

const login = async(username, password) => {

};

const authenticateToken = (req, res, next) => {
    
};
  
module.exports = {
    register,
    login,
    authenticateToken,
};