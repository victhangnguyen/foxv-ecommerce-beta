import passport from './passport.js';
import mongoose from 'mongoose';
import User from '../../models/User.js';

const isUser = function (req, res, next) {
  passport.authenticate('jwt', async function (err, user, info, status) {
    const userId = req.params.userId;
    try {
      if (err) {
        return next(err);
      }

      const userDoc = await User.findById(user._id).populate('roles');

      if (!userDoc) {
        //! navigate login
        return res
          .status(401)
          .json({ success: false, message: '[passport] Unauthorized.' });
      }

      //! check Role
      const roles = userDoc.roles.map((role) => role.name);
      const isUser = roles.includes('user');
      const isAdmin = roles.includes('admin');

      if (!isUser) {
        return res
          .status(403) //! signout
          .json({ success: false, message: '[passport] Unauthenticated.' });
      }

      if (!isAdmin) {
        if (String(userDoc?._id) !== userId) {
          return res.status(403).json({
            //! try to access -> signout
            success: false,
            message: 'Unauthenticated! Role is Not permitted.',
          });
        }
      }

      req.user = userDoc;
      next();
    } catch (error) {
      throw error;
    }
  })(req, res, next);
};

export default isUser;
