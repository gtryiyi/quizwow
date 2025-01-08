const axios = require('axios');

const CLIENT_ID = '5jmz2zhpvhpe6pgenh9didik787tvr'; // Replace with your Twitch client ID
const CLIENT_SECRET = 'najc14d07o7pkwbldjpvzmxj7pf32i'; // Replace with your Twitch client secret
const REDIRECT_URI = 'https://quizwow.vercel.app/api/twitch-callback'; // Update with your app's URL

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
    res.json({ user }); // Respond with user data
  } catch (error) {
    console.error(error);
    res.status(500).send('Error authenticating with Twitch.');
  }
};
