const { TokenExpiredError } = jwt;

export const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: 'Unauthorized! Access Token was expired!' });
  }

  return res.sendStatus(401).send({ message: 'Unauthorized!' });
};

export function CustomError(statusCode, message) {
  // create an error object
  const error = new Error(message);
  // add custom properties
  error.statusCode = statusCode;
  // return the error object
  return error;
}
