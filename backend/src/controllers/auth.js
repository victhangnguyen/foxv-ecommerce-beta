import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
//! imp Library
import Logging from '../library/Logging.js';
//! imp Models
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
//! imp Configs
import config from '../config/index.js';
//! imp utils
import generatePassword from '../utils/generatePassword.js';

import {
  generateAccessToken,
  generateRefreshToken,
  findOrGenerateRefreshToken,
  verifyRefreshToken,
} from '../services/authService.js';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

export const signup = async (req, res, next) => {
  const { firstName, lastName, username, email, phoneNumber, password } =
    req.body;
  try {
    //! check existing
    // Check if username or email already exists
    const existingUser = await User.findOne().or([{ username }, { email }]);

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists.' });
    }

    //! generatePassword and hash password
    const password = generatePassword(12);
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // create newUser with hashed password
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
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
      to: email,
      subject: 'Welcome to Foxv Ecommerce Beta',
      text: 'Please click on the following link to login your email address:',
      html: `
      <div>
        <p>Please click <a href="http://localhost:3000/auth/login">here</a> to login</p>
        <p>Username: ${username}</p>
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
    Logging.error('Error__ctrls__auth: ' + error);
    const err = new Error(error);
    err.httpStatusCode = 400;
    return next(err);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).populate('role').exec();
    if (!user || !user.comparePassword(password))
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.',
      });

    const token = generateAccessToken(user._id);
    console.log('__Debugger__auth\n__signin__token: ', token, '\n');
    const refreshToken = await generateRefreshToken(user._id);
    console.log(
      '__Debugger__auth\n__signin__refreshToken: ',
      refreshToken,
      '\n'
    );

    return res.status(201).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    Logging.error(error);
    res.status(500).json({
      success: false,
      message:
        'Oops! Something went wrong on our end. Please try again in a few minutes.',
    });
  }
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    // If refresh token is missing
    if (!refreshToken) {
      return res
        .status(403) //! Required re-signin
        .json({ success: false, message: 'Refresh token is required' });
    }

    verifyRefreshToken(refreshToken)
      .then((payload) => {
        const token = generateAccessToken(payload.sub);
        
        return res.status(201).json({
          success: true,
          message: 'refresh AccessToken successful',
          data: { token },
        });
      })
      .catch((error) => {
        if (error instanceof jwt.TokenExpiredError) {
          return res
            .status(403)
            .send({ message: 'Unauthorized! Access Token was expired!' });
        }

        return res.sendStatus(401).send({ message: 'Unauthorized!' });
      });
  } catch (error) {
    next(error);
  }
};
