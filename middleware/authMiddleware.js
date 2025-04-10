const jwt = require('jsonwebtoken');
require('dotenv').config();
// Basic Admin Check (replace with more robust user role system if needed)

const protect = (req, res, next) => {
    console.log('Request received:', req.method, req.url);
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role !== 'admin') {
                return res.status(401).json({ success: false, message: 'Not authorized, not an admin' });
            }

            console.log('Token verified:', decoded);

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

module.exports = { protect };