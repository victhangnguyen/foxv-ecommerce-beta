import mongoose from 'mongoose';
//! imp Library
import Logging from '../library/Logging.js';
//! imp Utils
import { execWithTransaction } from '../utils/transaction.js';

//! imp Models
import User from '../models/User.js';
import Role from '../models/Role.js';

//! imp Services
import userService from '../services/userService.js';

//! custom Connection
import config from '../config/index.js';
//! database
const db = mongoose.connection;

export const getUsersByFilters = async (req, res, next) => {
  const { keyword, sort, order, page, perPage } = req.query;

  let match = {};

  const skip = (page - 1) * perPage;

  try {
    if (keyword) {
      match.$or = [
        { firstName: new RegExp(keyword, 'i') },
        { lastName: new RegExp(keyword, 'i') },
        { phoneNumber: new RegExp(keyword, 'i') },
      ];
    }

    const result = await User.aggregate([
      { $match: match },
      {
        //! populate
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'roles',
        },
      },
      { $sort: { [sort]: +order } },
      {
        $facet: {
          users: [{ $skip: skip }, { $limit: +perPage }],
          usersCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const users = result[0].users;
    const usersCount = result[0].usersCount[0]?.count || 0;

    res.status(200).json({ users, usersCount });
  } catch (error) {
    Logging.error('Error__ctrls__user: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const deleteUsers = async (req, res, next) => {
  const userIds = req.query.ids;

  try {
    const results = await execWithTransaction(async (session) => {
      const promises = userIds.map(async (id) =>
        userService.deleteUser(id, session)
      );

      const results = await Promise.allSettled(promises);

      const hasRejected = results.some(
        (result) => result.status === 'rejected'
      );

      if (hasRejected) {
        throw new Error(
          results
            .find((result) => result.status === 'rejected')
            ?.reason.toString()
            .replace('Error: ', '')
        );
      }

      return results;
    });

    return res
      .status(200)
      .json({
        success: true,
        message: 'Delele Users Successful',
        data: { results },
      });
  } catch (error) {
    Logging.error('Error__ctrls__user: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const resetPasswords = async (req, res, next) => {
  const userIds = req.query.ids;

  try {
    await execWithTransaction(async (session) => {
      const promises = userIds.map(async (id) =>
        userService.resetPasswordAndSendEmail(id, session)
      );

      const results = await Promise.allSettled(promises);

      const hasRejected = results.some(
        (result) => result.status === 'rejected'
      );

      if (hasRejected) {
        throw new Error(
          results
            .find((result) => result.status === 'rejected')
            ?.reason.toString()
            .replace('Error: ', '')
        );
      }

      return res.status(200).json({ success: true, data: { ...results } });
    });
  } catch (error) {
    console.log('Error: ', error);
  }
};

export async function getUser(req, res, next) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).populate('roles').exec();

    if (!user) {
      throw new Error('User not found!');
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function updateUserInfo(req, res, next) {
  const userId = req.params.userId;
  const { firstName, lastName, username, email, phoneNumber } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
    }).exec();

    return res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function updateUserPassword(req, res, next) {
  const userId = req.params.userId;
  const { password, confirmPassword } = req.body;

  try {
    const user = await User.findById(userId).exec();
    user.password = password;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: 'Change password successful!' });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function updateRole(req, res, next) {
  const userId = req.params.userId;
  const roleName = req.query.role;
  try {
    const user = await User.findById(userId).populate('roles').exec();

    const hasRole = user.roles.map((role) => role.name).includes(roleName);
    const roleDoc = await Role.findOne({ name: roleName });

    // const updatedUser = await User.updateOne(
    //   { _id: userId },
    //   {
    //     $push: {
    //       roles: {
    //         $cond: [hasRole, '$noval', roleDoc._id],
    //       },
    //     },
    //     $pull: {
    //       roles: {
    //         $cond: [hasRole, roleDoc._id, '$noval'],
    //       },
    //     },
    //   }
    // );

    let updatedUser;
    if (hasRole) {
      //! exist => delelte Admin
      updatedUser = await User.updateOne(
        { _id: userId },
        {
          $pull: { roles: roleDoc._id },
        }
      );
    } else {
      //! no exist => create Admin
      updatedUser = await User.updateOne(
        { _id: userId },
        {
          $push: { roles: roleDoc._id },
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Change Role successful!',
      data: { user: updatedUser },
    });
  } catch (error) {
    Logging.error('Error__ctrls__product: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}
