const express = require('express');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const path = require('path');

const app = express();

// Twitch credentials and whitelist
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const WHITELIST = ['gtryiyi', 'otherAuthorizedUser'];

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to enforce login
app.use(async (req, res, next) => {
    const token = req.cookies['auth_token'];

    // Allow login and callback routes without authentication
    if (req.path === '/api/twitch-login' || req.path === '/api/twitch-callback') {
        return next();
    }

    // Redirect to Twitch login if no token is found
    if (!token) {
        return res.redirect('/api/twitch-login');
    }

    try {
        // Verify the token with Twitch API
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': CLIENT_ID,
            },
        });

        const username = userResponse.data.data[0].login;

        // Check if the user is on the whitelist
        if (WHITELIST.includes(username)) {
            req.user = username; // Attach user info to request
            return next();
        } else {
            return res.status(403).send('Access Denied: You are not on the whitelist.');
        }
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.redirect('/api/twitch-login');
    }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Twitch login route
app.get('/api/twitch-login', (req, res) => {
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&response_type=code&scope=user:read:email`;
    res.redirect(authUrl);
});

// Twitch callback route
app.get('/api/twitch-callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code missing.');
    }

    try {
        // Exchange authorization code for an access token
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

        // Set the access token as an HTTP-only cookie
        res.cookie('auth_token', access_token, { httpOnly: true });

        // Redirect to the homepage after login
        res.redirect('/');
    } catch (error) {
        console.error('Error during Twitch authentication:', error.message);
        res.status(500).send('Authentication failed. Please try again.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
