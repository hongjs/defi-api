const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const keys = require('../configs/keys')
const users = require('../configs/users')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, done) => {
      const user = users.find((i) => i.username === username && i.password === password)
      if (user) {
        const { password, ..._user } = user
        return done(null, _user, {
          message: 'Logged In Successfully',
        })
      } else {
        return done(null, false, {
          message: 'Incorrect username or password.',
        })
      }
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromExtractors([
        ExtractJWT.fromAuthHeaderAsBearerToken(),
        ExtractJWT.fromUrlQueryParameter('token'),
      ]),
      secretOrKey: keys.tokenSecret,
    },
    (jwtPayload, done) => {
      try {
        const user = users.find((i) => i.username === jwtPayload.username)
        if (user) {
          const { password, ..._user } = user
          return done(null, _user)
        } else {
          return done(null, false)
        }
      } catch (error) {
        return done(error, false)
      }
    }
  )
)
