import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
//! imp Library
import Logging from '../library/Logging.js';
//! imp Utils
import { execWithTransaction } from '../utils/transaction.js';
import sendEmail from '../utils/sendEmail.js';

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
        { username: new RegExp(keyword, 'i') },
        { firstName: new RegExp(keyword, 'i') },
        { lastName: new RegExp(keyword, 'i') },
        { phoneNumber: new RegExp(keyword, 'i') },
      ];
    }

    const result = await User.aggregate([
      { $match: match },
      { $sort: { [sort]: +order, _id: 1 } },
      {
        //! populate
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'roles',
        },
      },
      {
        $facet: {
          users: [{ $skip: skip }, { $limit: +perPage }],
          usersCount: [{ $count: 'count' }],
        },
      },
    ]).exec();

    const users = result[0].users;
    const usersCount = result[0].usersCount[0]?.count || 0;

    res.status(200).json({
      success: true,
      message: 'Get users by Filters successful!',
      data: { users, usersCount },
    });
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

    return res.status(200).json({
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

export async function getUserById(req, res, next) {
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

export const createUser = async (req, res, next) => {
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  };
  try {
    // Check if username or email already exists
    const existingUser = await User.findOne().or([
      { username: userData.username },
      { email: userData.email },
    ]);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists.' });
    }

    //! generatePassword and hash password
    const password = userService.generatePassword(12);

    // create newUser with hashed password
    const newUser = new User({
      ...userData,
      password,
    });

    // save newUser to database
    await newUser.save();

    // Send verification email to registered email
    const emailUsername = config.general.email.emailUsername;
    const emailPassword = config.general.email.emailPassword;

    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: 'Gmail',
        auth: {
          user: emailUsername,
          pass: emailPassword,
        },
      })
    );

    const mailOptions = {
      from: emailUsername,
      to: userData.email,
      subject: 'Welcome to Foxv Ecommerce Beta',
      text: 'Please click on the following link to login your email address:',
      html: `
      <div>
        <p>Please click <a href="http://localhost:3000/auth/login">here</a> to login</p>
        <p>Username: ${userData.username}</p>
        <p>Password: ${password}</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        Logging.error('Error sending email:' + error);
        return res.status(500).json({
          success: false,
          message: 'You have failed to register an account.',
        });
      }
      Logging.success('Email sent:' + info.response);
      return res.status(201).json({
        success: true,
        message: 'You have successfully registered an account!',
        data: {
          user: newUser,
        },
      });
    });
  } catch (error) {
    Logging.error('Error__ctrls__user: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export async function updateUser(req, res, next) {
  const userId = req.params.userId;

  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  };
  console.log('__Debugger__user\n__updateUser__userData: ', userData, '\n');

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData).exec();

    return res
      .status(200)
      .json({
        success: true,
        message: 'Update an User Infomation successful!',
        data: { updatedUser },
      });
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
