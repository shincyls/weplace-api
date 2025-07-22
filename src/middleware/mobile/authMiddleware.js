const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../../models/user/userModel');

const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: false, message: 'Unauthorized user' });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user_id);
        const time = moment(decoded.timestamp);
        const expired = (moment() - time > 3600000) ? true : false;

        if (!user) {
            return res.status(401).json({ status: false, message: 'Unauthorized User' });
        }

        if (expired) {
            return res.status(401).json({ status: false, message: 'Session Expired' });
        }

        req.user_id = user.id;
        req.seller_id = decoded.seller_id;
        req.location_id = decoded.location_id;
        req.role = decoded.role;
        req.username = decoded.username, 
        req.email = decoded.email,
        req.phone = decoded.phone,
        req.app_device = "",
        req.app_version = 0,
        req.app_lang = 0

        next();

    } catch (error) {
        return res.status(400).json({ status: false, message: 'Unauthorized Access' });
    }
};

module.exports = checkAuth;