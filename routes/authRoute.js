const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const keys = require('../configs/keys');

router.post('/login', (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);

      if (user) {
        const token = jwt.sign(user, keys.tokenSecret, {
          expiresIn: keys.tokenExpiresIn,
        });
        const tokenData = jwt.verify(token, keys.tokenSecret);

        return res.json({
          success: true,
          message: 'Authentication successful',
          user: user,
          token: token,
          expirationDate: tokenData.exp,
        });
      } else {
        return res.status(401).json(info);
      }
    }
  )(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout();
  res.send({});
});

router.get('/server_status', (req, res, next) => {
  res.send({ online: true });
});

module.exports = router;
