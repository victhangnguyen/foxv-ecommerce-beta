import passport from './passport.js';
import mongoose from 'mongoose';

const isAdmin = function (req, res, next) {
  passport.authenticate('jwt', async function (err, user, info, status) {
    if (err) {
      return next(err);
    }
    console.log('__Debugger__isAdmin\n__authenticate__user: ', user, '\n');
    if (!user) {
      //! navigate login
      return res.status(401).json({ message: 'Unauthorized.' });
    }
    //! check Role
    const adminUser = await mongoose
      .model('User')
      .findById(user._id)
      .populate('role');
    console.log('adminUser: ', adminUser);


    const existingRole = adminUser.role
      .map((role) => role.name)
      .includes('admin');

    if (!existingRole) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    req.user = user;
    //! navigate main
    next();
  })(req, res, next);
};

export default isAdmin;
