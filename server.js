const express = require('express');
const path = require('path');
const app = express();

// Environment variables for Twitch
const CLIENT_ID = process.env.CLIENT_ID; // Ensure this is set in your environment variables
const REDIRECT_URI = process.env.REDIRECT_URI; // Example: "https://your-vercel-app-url.com/api/twitch-callback"
const AUTH_URL = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user:read:email`;

// Serve static files from the current root directory
app.use(express.static(__dirname));

// Serve specific subdirectories for assets
app.use('/api', express.static(path.join(__dirname, 'api')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));

// Routes for your HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/quiz_clase_storm', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz_clase_storm.html'));
});

app.get('/quiz_raza_storm', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz_raza_storm.html'));
});

app.get('/ruleta', (req, res) => {
    res.sendFile(path.join(__dirname, 'ruleta.html'));
});

// Add the Twitch login route
app.get('/login', (req, res) => {
    // Redirect the user to Twitch's authorization page
    res.redirect(AUTH_URL);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
