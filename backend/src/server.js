import path from 'path';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

//! library
import Logging from './library/Logging.js';

//! config
import config from './config/index.js';

//! imp Routes
import userRouter from './routes/user.js';
const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());

//! static public
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

//! static /images
const imagesDir = path.join(__dirname, '..', 'images');
app.use('/images', express.static(imagesDir));

app.use('/api/users', userRouter);

config.db
  .connectMongoDB()
  .then((result) => {
    app.listen(config.db.server.port, () => {
      Logging.log(`Server running on port ${config.db.server.port} 🚀🚀🚀`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
