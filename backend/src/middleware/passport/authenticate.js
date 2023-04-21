import passport from './passport.js';
import mongoose from 'mongoose';
import User from '../../models/User.js';

const authenticate = function (req, res, next) {
  passport.authenticate('jwt', async function (err, user, info, status) {
    try {
      if (err) {
        return next(err);
      }
      const userDoc = await User.findById(user._id).populate('roles');

      if (!userDoc) {
        //! navigate login
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized.' }); //! Unauthenticated
      }

      //! check Role
      const roles = userDoc.roles.map((role) => role.name);
      const isUser = roles.includes('user');

      //! Activative Account
      if (!isUser) {
        return res
          .status(403) //! signout
          .json({ success: false, message: 'Your account is not activated.' });
      }

      req.user = userDoc;
      next();
    } catch (error) {
      throw error;
    }
  })(req, res, next);
};

export default authenticate;
