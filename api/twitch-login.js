export default (req, res) => {
  const CLIENT_ID = '5jmz2zhpvhpe6pgenh9didik787tvr'; // Replace with your Twitch Client ID
  const REDIRECT_URI = 'https://quizwow.vercel.app/api/twitch-callback'; // Replace with your app URL

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=`;

  res.redirect(twitchAuthUrl);
};
