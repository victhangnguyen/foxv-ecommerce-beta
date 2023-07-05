import passport from './passport.js';
import mongoose from 'mongoose';

const isAdmin = async function (req, res, next) {
  try {
    //! check Role
    const roles = req.user.roles.map((role) => role.name);
    console.log('__Debugger__isAdmin\n__isAdmin__roles: ', roles, '\n');
    const isAdmin = roles.includes('admin');

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this function.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isAdmin;
