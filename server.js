const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the current root directory
app.use(express.static(__dirname));

// Serve specific subdirectories for assets (optional but recommended for clarity)
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
