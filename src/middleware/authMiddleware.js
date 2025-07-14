const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/user/userModel');

const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: false, message: 'Unauthorized user' });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        const time = moment(decoded.timestamp);
        const expired = (moment() - time > 3600000) ? true : false;

        if (!user) {
            return res.status(401).json({ status: false, message: 'Unauthorized User' });
        }

        if (expired) {
            return res.status(401).json({ status: false, message: 'Session Expired' });
        }

        req.user = user;
        req.seller = decoded.seller;
        req.role = decoded.role;

        next();

    } catch (error) {
        return res.status(401).json({ status: false, message: 'Unauthorized user' });
    }
};

module.exports = checkAuth;