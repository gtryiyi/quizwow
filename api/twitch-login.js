export default (req, res) => {
  const CLIENT_ID = process.env.CLIENT_ID; // Twitch Client ID from environment variables
  const REDIRECT_URI = process.env.REDIRECT_URI; // Redirect URI from environment variables

  // Scopes: no email needed, just basic authentication
  const SCOPES = [];

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPES.join(' '))}`;

  res.redirect(twitchAuthUrl);
};
