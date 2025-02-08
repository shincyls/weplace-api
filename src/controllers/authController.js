const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,       // Google Client ID in .env
    process.env.GOOGLE_CLIENT_SECRET,  // Google Client Secret in .env
    process.env.GOOGLE_REDIRECT_URI    // Google Redirect URI in .env
);

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
             token: token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.googleSignIn = async (req, res) => {
    const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI
    });
    res.redirect(authUrl);
};

exports.googleCallback = async (req, res) => {

    const code = req.query.code;

    if (!code) {
        return res.status(400).send('Authorization code not provided.');
    }

    try {
        const { tokens } = await oAuth2Client.getToken({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        });
        oAuth2Client.setCredentials(tokens);

        // Retrieve user profile information
        const userInfoResponse = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });

        const userInfo = userInfoResponse.data;

        // Check if user exists in the database
        let user = await User.findOne({ email: userInfo.email });
        if (user) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // If user does not exist, create a new user
        user = new User({
            name: userInfo.name,
            email: userInfo.email,
            username: userInfo.email,
            oauthProvider: 'google',
            oauthId: userInfo.sub
        });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        res.status(200).json({
            message: 'Authentication successful',
            userInfo,
            token
        });

    } catch (error) {
        console.error('Error during callback:', error);
        res.status(500).send('Authentication failed.');
    }
   
};

exports.googleLogout = async (req, res) => {
    oAuth2Client.revokeCredentials();
    res.send('Logged out');
};