import multer from 'multer';

//! name: product
//! dest: products

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/images/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + '.jpg');
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadImages = multer({ storage: fileStorage, fileFilter: fileFilter }).array(
  'images[]',
  12
);

const uploadHandler = (req, res, next) => {
  uploadImages(req, res, (err) => {
    if (err) {
      // res.status(400).json({ message: `Bad request, ${err.message}` }).end();
      return res.status(400).json({ message: `Bad request, ${err.message}` });
    } else {
      // special workaround for files validating with express-validator
      req.body.images = req.files;
      next();
    }
  });
};

export default uploadHandler;
