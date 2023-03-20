import jwt from 'jsonwebtoken';

const { TokenExpiredError } = jwt;

export const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: 'Unauthorized! Access Token was expired!' });
  }

  return res.sendStatus(401).send({ message: 'Unauthorized!' });
};

class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    // Call parent constructor
    this.statusCode = statusCode;
    // this.name = 'HttpError';
  }
}

export default HttpError;
