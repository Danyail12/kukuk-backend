import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';
import Expert from './../models/expert'; // Adjust the path accordingly

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'your-secret-key';  // Replace with your actual secret key

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const expert = await Expert.findById(jwt_payload.sub);
      if (expert) {
        return done(null, expert);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport.authenticate('jwt', { session: false });
