const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: false, message: 'Unauthorized user' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ status: false, message: 'Unauthorized User' });
        }

        req.user = user; // Attach the user data to the request object
        req.seller = seller; // If Seller routes are needed
        // req.role = role; // If Admin or VIP routes are needed

        next(); // Allow the request to proceed to the next middleware or route handler

    } catch (error) {
        return res.status(401).json({ status: false, message: 'Unauthorized user' });
    }
};

module.exports = checkAuth;