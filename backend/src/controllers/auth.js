import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import jwt from "jsonwebtoken";
//! imp Library
import Logging from "../library/Logging.js";
//! imp Utils
import sendEmail from "../utils/sendEmail.js";
//! imp Services
import userService from "../services/userService.js";
import authService from "../services/authService.js";
//! imp Models
import User from "../models/User.js";
import Role from "../models/Role.js";
//! imp Configs
import config from "../config/index.js";

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
        .json({ message: "Username or email already exists." });
    }

    //! generatePassword and hash password
    const password = userService.generatePassword(12);

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
        service: "Gmail",
        auth: {
          user: emailUsername,
          pass: emailPassword,
        },
      })
    );

    const mailOptions = {
      from: emailUsername,
      to: email,
      subject: "Welcome to Foxv Ecommerce Beta",
      text: "Please click on the following link to login your email address:",
      html: `
      <div>
        <p>Please click <a href="${config.db.client.baseURL}/auth/login">here</a> to login</p>
        <p>Username: ${username}</p>
        <p>Password: ${password}</p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        Logging.error("Error sending email:" + error);
        return res.status(500).json({
          success: false,
          message: "You have failed to register an account.",
        });
      }
      Logging.success("Email sent:" + info.response);
      return res.status(201).json({
        success: true,
        message: "You have successfully registered an account!",
        data: {
          user: newUser,
        },
      });
    });
  } catch (error) {
    Logging.error("Error__ctrls__auth: " + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  console.log('__Debugger__auth\n__signin__req.body: ', req.body, '\n');

  try {
    const user = await User.findOne({ username }).populate("roles").exec();
    if (!user || !user.comparePassword(password))
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });

    const token = authService.generateAccessToken(user._id);
    const refreshToken = await authService.generateRefreshToken(user._id);
    console.log(
      "__Debugger__auth\n__signin__refreshToken: ",
      refreshToken,
      "\n"
    );

    return res.status(201).json({
      success: true,
      message: "Login successful",
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
        "Oops! Something went wrong on our end. Please try again in a few minutes.",
    });
  }
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  console.log(
    "__Debugger__auth\n__refreshToken__refreshToken: ",
    refreshToken,
    "\n"
  );

  try {
    // If refresh token is missing
    if (!refreshToken) {
      return res
        .status(403) //! Required re-signin
        .json({ success: false, message: "Refresh token is required" });
    }

    authService
      .verifyRefreshToken(refreshToken)
      .then((payload) => {
        const token = authService.generateAccessToken(payload.sub);

        return res.status(201).json({
          success: true,
          message: "Refresh AccessToken successful",
          data: { token },
        });
      })
      .catch((error) => {
        if (error instanceof jwt.TokenExpiredError) {
          return res.status(403).json({
            success: false,
            // message: 'Unauthorized! Refresh Token was expired.',
            message:
              "Your session has expired. Please log in again to continue using our service.",
          });
        }

        return res
          .status(401)
          .json({ success: false, message: "Unauthorized!" });
      });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist!" });
    }

    const newPassword = userService.generatePassword(12);

    user.password = newPassword;

    const htmlTemplate = `
      <div>
        <p>Bạn đã khôi phục mật khẩu</p>
        <p>Mật khẩu hiện tại của bạn là: ${user.password}</p>
      </div>
      `;

    // email, subject, text, template
    const info = await sendEmail(
      email,
      "Khôi phục mật khẩu",
      "Khôi phục mật khẩu",
      htmlTemplate
    );

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Recover password successful!", info });
  } catch (error) {
    next(error);
  }
};
