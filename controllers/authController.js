const jwt = require('jsonwebtoken');
require('dotenv').config();

// @desc    Authenticate admin and get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        const isAdmin = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD;

        if (!isAdmin) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const payload = {
            id: 1,
            role: 'admin'
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' 
        });

        res.status(200).json({
            success: true,
            token: token
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};