const jwt = require('jsonwebtoken');

let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}

const AuthController = {
  async token(req, res) {
    const refreshToken = await req.body().token;
    if (refreshToken == null) return res.error(401);
    if (!refreshTokens.includes(refreshToken)) return res.error(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.error(403);
      const accessToken = generateAccessToken(user);
      res.json(200, { accessToken });
    });
  },
  async logout(req, res) {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.json(204);
  },
  async login(req, res) {
    const { username } = req.body;
    const user = { name: username };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  },
};

module.exports = AuthController;
