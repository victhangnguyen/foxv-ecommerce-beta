//! imp Library
import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT
  ? process.env.SERVER_PORT
  : 5000;

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1';

const config = {
  port: SERVER_PORT,
  baseURL: BASE_URL,
};

export default config;