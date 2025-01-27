const express = require('express');
const axios = require('axios');
const app = express();

// Whitelist of Twitch usernames
const WHITELIST = ['gtryiyi', 'otherAuthorizedUser'];

app.use(async (req, res, next) => {
    // Skip authentication for static assets
    if (req.url.match(/\.(html|css|js|png|jpg|jpeg|gif|svg|ttf)$/)) {
        return next();
    }

    const token = req.cookies?.accessToken;

    if (!token) {
        // Redirect to Twitch login if no token is found
        return res.redirect(
            `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=user:read:email`
        );
    }

    try {
        // Verify token and get user info
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Client-Id': process.env.CLIENT_ID,
            },
        });

        const username = userResponse.data.data[0].login;

        if (WHITELIST.includes(username)) {
            req.user = username; // Store user info in request object
            return next();
        } else {
            return res.status(403).send('Access Denied: You are not on the whitelist.');
        }
    } catch (error) {
        console.error('Authentication error:', error.response?.data || error.message);
        return res.redirect('/'); // Redirect to home if token verification fails
    }
});

// Serve static files
app.use(express.static('public')); // Ensure your static files are in a 'public' folder

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
