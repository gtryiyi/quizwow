const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// whitelist of Twitch usernames
const WHITELIST = ['gtryiyi', 'otherAuthorizedUser']; // Add authorized usernames here

export default async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code missing.');
  }

  try {
    // Exchange the authorization code for an access token
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

    // Fetch user details using the access token
    const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': CLIENT_ID,
      },
    });

    const user = userResponse.data.data[0]; // Extract user data
    const username = user.login; // Get Twitch username

    console.log(`User logged in: ${username}`);

    // Check if the username is on the whitelist
    if (WHITELIST.includes(username)) {
      // Redirect to the index page if authorized
      res.redirect('/');
    } else {
      // Deny access if not authorized
      res.status(403).send('Access Denied: You are not on the whitelist.');
    }
  } catch (error) {
    console.error('Error during Twitch authentication:', error.response?.data || error.message);
    res.status(500).send('Authentication failed. Please try again.');
  }
};
