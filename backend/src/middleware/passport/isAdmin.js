import passport from './passport.js';
import mongoose from 'mongoose';

const isAdmin = function (req, res, next) {
  passport.authenticate('jwt', async function (err, user, info, status) {
    try {
      if (err) {
        return next(err);
      }

      const userDoc = await mongoose
        .model('User')
        .findById(user._id)
        .populate('roles')
        .exec();

      if (!userDoc) {
        //! navigate login
        return res
          .status(401)
          .json({ success: false, message: '[passport] Unauthorized.' });
      }

      //! check Role
      const isAdmin = userDoc.roles.map((role) => role.name).includes('admin');

      if (!isAdmin) {
        return res
          .status(403) //! signout
          .json({ success: false, message: '[passport] Unauthenticated.' });
      }

      req.user = userDoc;
      next();
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

export default isAdmin;
