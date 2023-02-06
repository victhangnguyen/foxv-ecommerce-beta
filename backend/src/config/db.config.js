//! library
import Logging from '../library/Logging.js';
import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

const MONGO_CLUSTER = process.env.MONGO_CLUSTER || '';
const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_DATABASE = process.env.MONGO_DATABASE || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.mongodb.net/${MONGO_DATABASE}`;

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 1337;

const config = {
  mongo: {
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
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
