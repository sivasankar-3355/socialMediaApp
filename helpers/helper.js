require('dotenv').config()
const jwt = require('jsonwebtoken')
const jwtSecret = 'gezzal'
const verifyToken = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, jwtSecret);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.user = decodedToken;
    next();
}

module.exports = { verifyToken }