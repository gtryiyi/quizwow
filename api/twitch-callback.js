const axios = require('axios');

// Your Twitch credentials
const CLIENT_ID = '5jmz2zhpvhpe6pgenh9didik787tvr';
const CLIENT_SECRET = 'najc14d07o7pkwbldjpvzmxj7pf32i';
const REDIRECT_URI = 'https://quizwow.vercel.app/api/twitch-callback';

// Your whitelist of Twitch usernames
const WHITELIST = ['gtryiyi']; // Replace with real usernames

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

    // Use the access token to fetch user details
    const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': CLIENT_ID,
      },
    });

    const user = userResponse.data.data[0];

    // Check if the user is on the whitelist
    if (WHITELIST.includes(user.login)) {
      // Redirect to the index page for authorized users
      res.redirect('/');
    } else {
      // Deny access for unauthorized users
      res.status(403).send('Access Denied: You are not on the whitelist.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error authenticating with Twitch.');
  }
};
