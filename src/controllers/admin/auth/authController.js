const Admin = require('../models/admin/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

exports.localSignUp = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const admin = await Admin.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username is already taken' });
        }
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
        const newAdmin = await Admin.create(req.body);
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
};

exports.localSignIn = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        res.status(200).json({
             user_id: user.id,
             username: user.username, 
             email: user.email,
             location: user.locationId,
             timestamp: moment().format(),
             token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};