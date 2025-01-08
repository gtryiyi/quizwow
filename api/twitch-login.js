const axios = require('axios');

const CLIENT_ID = '5jmz2zhpvhpe6pgenh9didik787tvr';
const CLIENT_SECRET = 'najc14d07o7pkwbldjpvzmxj7pf32i';
const REDIRECT_URI = 'https://https://quizwow.vercel.app/api/twitch-callback';

export default async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect(
      `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=`
    );
  }

  try {
    // Exchange code for token
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

    // Fetch user information
    const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': CLIENT_ID,
      },
    });

    const user = userResponse.data.data[0];
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error authenticating with Twitch');
  }
};
