import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;

const config = {
  node: {
    environment: NODE_ENV,
    jwtSecret: JWT_SECRET,
  },
};

export default config;
