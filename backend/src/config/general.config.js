import dotenv from 'dotenv';

dotenv.config();

//! node
const NODE_ENV = process.env.NODE_ENV || 'development';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const RESET_PASSWORD_TOKEN_SECRET = process.env.RESET_PASSWORD_TOKEN_SECRET;
const RESET_PASSWORD_TOKEN_EXPIRY = process.env.RESET_PASSWORD_TOKEN_EXPIRY;
//! email
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const config = {
  node: {
    environment: NODE_ENV,
    accessTokenSecret: ACCESS_TOKEN_SECRET,
    accessTokenExpiry: ACCESS_TOKEN_EXPIRY,
    refreshTokenSecret: REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: REFRESH_TOKEN_EXPIRY,
    resetPasswordTokenSecret: RESET_PASSWORD_TOKEN_SECRET,
    resetPasswordTokenExpiry: RESET_PASSWORD_TOKEN_EXPIRY,
  },
  email: {
    emailUsername: EMAIL_USERNAME,
    emailPassword: EMAIL_PASSWORD,
  },
};

export default config;
