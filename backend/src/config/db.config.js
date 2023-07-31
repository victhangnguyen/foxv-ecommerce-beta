//! imp Library
import Logging from "../library/Logging.js";
import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const DB_PORT = process.env.DB_PORT || 5000;
const DB_HOST = process.env.DB_HOST || "http://127.0.0.1";
const DB_URL = process.env.DB_URL || `${DB_HOST}:${DB_PORT}`;

const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const CLIENT_HOST = process.env.CLIENT_HOST || "http://127.0.0.1";
const CLIENT_URL = process.env.CLIENT_URL || `${CLIENT_HOST}:${CLIENT_PORT}`;

const MONGO_CLUSTER = process.env.MONGO_CLUSTER || "";
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_DATABASE = process.env.MONGO_DATABASE || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DATABASE}`;
//! SEEDER
const IS_SEEDER = process.env.IS_SEEDER || false;

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 1337;

const config = {
  mongo: {
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    url: MONGO_URL,
  },
  client: {
    port: CLIENT_PORT,
    host: CLIENT_HOST,
    baseURL: CLIENT_URL,
  },
  server: {
    port: DB_PORT,
    host: DB_HOST,
    baseURL: DB_URL,
  },
  data: {
    isSeeder: IS_SEEDER,
  },
  //!
  connectMongoDB: async () => {
    return mongoose
      .connect(MONGO_URL)
      .then((result) => {
        Logging.log(`Connected to MongooDB!`);
      })
      .catch((err) => {
        // console.error('Error: ' + err.message);
        Logging.error(`Error: ${err.message}`);
        //! 1 - Uncaught Fatal Exception: There was an uncaught exception, and it was not handled by a domain or an uncaughtException event handler.
        process.exit(1);
      });
  },
};

export default config;
