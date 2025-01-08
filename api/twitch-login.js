export default (req, res) => {
  const CLIENT_ID = '5jmz2zhpvhpe6pgenh9didik787tvr'; // Replace with your Twitch Client ID
  const REDIRECT_URI = 'https://quizwow.vercel.app/api/twitch-callback'; // Replace with your app's redirect URI

  // Scopes: no email needed, just basic authentication
  const SCOPES = [];

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES.join(' '))}`;

  res.redirect(twitchAuthUrl);
};
