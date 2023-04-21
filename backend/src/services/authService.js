import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
//! imp Library
import Logging from '../library/Logging.js';

//! imp Configs
import config from '../config/index.js';

function generateAccessToken(userId) {
  const payload = {
    sub: userId,
  };
  const secretOrPrivateKey = config.general.node.accessTokenSecret;
  const options = {
    expiresIn: config.general.node.accessTokenExpiry,
  };
  return jwt.sign(payload, secretOrPrivateKey, options);
}

function generateRefreshToken(userId) {
  const payload = {
    sub: userId,
  };
  const secretOrPrivateKey = config.general.node.refreshTokenSecret;
  const options = {
    expiresIn: config.general.node.refreshTokenExpiry,
  };
  return jwt.sign(payload, secretOrPrivateKey, options);
}

function generateResetPasswordToken(payload) {
  //! payload: { email: ... }
  const secretOrPrivateKey = config.general.node.resetPasswordTokenSecret;
  const options = {
    expiresIn: config.general.node.resetPasswordTokenExpiry,
  };
  return jwt.sign(payload, secretOrPrivateKey, options);
}

async function findOrGenerateRefreshToken(userId) {
  try {
    //! find refreshToken by userId
    let refreshToken = await mongoose
      .model('RefreshToken')
      .findOne({ user: userId });
    // if no refresh token or expired, create new RefreshToken
    if (!refreshToken || Date.now() >= refreshToken.expiresAt) {
      await mongoose.model('RefreshToken').deleteOne({ user: userId });

      // create a new refresh token with an expiration time of 1 day
      refreshToken = new mongoose.model('RefreshToken')({
        user: userId,
        token: generateRefreshToken(userId),
        expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000, // milliseconds
      });
      // save the new refresh token to the database
      await refreshToken.save();
    }
    // return the refresh token string to be used by other functions
    return refreshToken.token;
  } catch (error) {
    console.log('Error-findOrGenerateRefreshToken: ', error);
    throw error;
  }
}

async function verifyRefreshToken(refreshToken) {
  try {
    return jwt.verify(
      refreshToken,
      config.general.node.refreshTokenSecret,
      function (error, payload) {
        if (error) {
          throw error;
        }

        return payload;
      }
    );
  } catch (error) {
    console.log('Error-verifyRefreshToken: ', error);
    throw error;
  }
}

export default {
  generateAccessToken,
  generateRefreshToken,
  generateResetPasswordToken,
  findOrGenerateRefreshToken,
  verifyRefreshToken,
};
