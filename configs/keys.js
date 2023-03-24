module.exports = {
  tokenSecret: process.env.JWT_SECRET || 'JWT_SECRET',
  tokenExpiresIn: process.env.JWT_EXPIRE || '365d',
};
