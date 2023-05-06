import passport from './passport.js';
import mongoose from 'mongoose';
import User from '../../models/User.js';

async function isUser(req, res, next) {
  const userId = req.params.userId;
  try {
    //! check Role
    const roles = req.user.roles.map((role) => role.name);
    const isAdminController = roles.includes('admin');

    const userDoc = await User.findById(req.user._id).populate('roles');

    if (!isAdminController) {
      if (String(userDoc?._id) !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthenticated! Require Admin Role.',
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
//   const userId = req.params.userId;
//   try {
//     if (err) {
//       return next(err);
//     }

//     const userDoc = await User.findById(user._id).populate('roles');

//     if (!userDoc) {
//       //! navigate login
//       return res
//         .status(401)
//         .json({ success: false, message: 'Unauthorized.' }); //! Unauthenticated
//     }

//     //! check Role
//     const roles = userDoc.roles.map((role) => role.name);
//     const isUser = roles.includes('user');
//     const isAdmin = roles.includes('admin');

//     if (!isUser) {
//       return res
//         .status(403) //! signout
//         .json({ success: false, message: '[passport] Unauthenticated.' });
//     }

//     if (!isAdmin) {
//       if (String(userDoc?._id) !== userId) {
//         return res.status(403).json({
//           success: false,
//           message: 'Unauthenticated! Require Admin Role.',
//         });
//       }
//     }

//     req.user = userDoc;
//     next();
//   } catch (error) {
//     throw error;
//   }
// })(req, res, next);

export default isUser;
