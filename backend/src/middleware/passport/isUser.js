import passport from './passport.js';
import mongoose from 'mongoose';

const isUser = function (req, res, next) {
  passport.authenticate('jwt', async function (err, user, info, status) {
    if (err) {
      return next(err);
    }
    if (!user) {
      //! navigate login
      return res
        .status(400)
        .json({ success: false, message: '[passport] Unauthenticated.' });
    }
    //! check Role
    const adminUser = await mongoose
      .model('User')
      .findById(user._id)
      .populate('role');

    const existingRole = adminUser.role
      .map((role) => role.name)
      .includes('user');

    if (!existingRole) {
      return res
        .status(400)
        .json({ success: false, message: '[passport] Unauthorized.' });
    }

    req.user = user;
    //! navigate main
    next();
  })(req, res, next);
};

export default isUser;
