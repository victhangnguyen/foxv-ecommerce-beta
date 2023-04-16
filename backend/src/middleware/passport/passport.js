import passport from 'passport';
import mongoose from 'mongoose';

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

//! imp Config
import config from '../../config/index.js';

// Define options for JWT Strategy
const JwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.general.node.accessTokenSecret,
  // issuer: 'http://localhost:3000',
  // audience: 'http://localhost:3000',
};

//! create JwtStrategy Instance
const jwtStrategy = new JwtStrategy(
  JwtStrategyOptions,
  async (payload, done) => {
    try {
      const user = await mongoose
        .model('User')
        .findById(payload.sub)
        .populate('roles');
        
      if (!user) {
        return done(null, false); //! err: null, user: false
      }
      
      done(null, user); //! err: null, user: user
    } catch (error) {
      done(error, false); //! err: error, user: false
    }
  }
);

//! tell Passport use the jwtLogin
passport.use('jwt', jwtStrategy);

export default passport;
