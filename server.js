const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const app = express();

// Twitch credentials and whitelist
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const WHITELIST = ['gtryiyi', 'otherAuthorizedUser'];

// Middleware
app.use(cookieParser());

// Helper function to validate session
async function validateSession(req, res, next) {
    const token = req.cookies['auth_token'];

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': CLIENT_ID,
            },
        });

        const username = userResponse.data.data[0].login;

        if (WHITELIST.includes(username)) {
            req.user = username; // Attach user info for later use
            return next();
        } else {
            return res.status(403).send('Access Denied: You are not on the whitelist.');
        }
    } catch (error) {
        console.error('Session validation failed:', error.message);
        return res.redirect('/login');
    }
}

// Apply authentication to all routes
app.use(validateSession);

// Static file routes
app.use(express.static(path.join(__dirname)));

// Login route
app.get('/login', (req, res) => {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&response_type=code&scope=user:read:email`;
    res.redirect(authUrl);
});

// Twitch OAuth callback route
app.get('/api/twitch-callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code missing.');
    }

    try {
        const tokenResponse = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: REDIRECT_URI,
            },
        });

        const { access_token } = tokenResponse.data;
        res.cookie('auth_token', access_token, { httpOnly: true });

        res.redirect('/');
    } catch (error) {
        console.error('Error during Twitch authentication:', error.message);
        res.status(500).send('Authentication failed. Please try again.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
