import config from '../config/index.js';

//! Not Found - Error Handling
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

//! Error Handling
const errorHandler = (err, req, res, next) => {
  const NODE_ENV = config.general.node.environment;

  console.log('__Debugger__server__err.statusCode: ', res.statusCode);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  //! sai id, stError: Cast to ObjectId failed for value \"123\" (type string) at path \"_id\" for model \"User\"\n
  //! Promise return 200 Rejected => 500
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
