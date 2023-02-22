import path from 'path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import url from 'url';

//! imp Utils
import * as fileHelper from './utils/file.js';
//! imp Library
import Logging from './library/Logging.js';
//! imp Config
import config from './config/index.js';
//! imp Routes
import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import categoryRouter from './routes/category.js';
import subCategoryRouter from './routes/subCategory.js';

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());

//! static public
//! __dirname:  C:\Users\victh\foxv-ecommerce-beta\backend\src\
//! __dirname:  C:\Users\victh\foxv-ecommerce-beta\backend\public
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

//! static /images
//! __dirname:  C:\Users\victh\foxv-ecommerce-beta\backend\images
const imagesDir = path.join(__dirname, '..', 'images');
app.use('/images', express.static(imagesDir));

app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', subCategoryRouter);

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
