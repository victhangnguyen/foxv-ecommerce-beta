import { validationResult, checkSchema } from 'express-validator';

export const validateSchema = (chemaValidation) => async (req, res, next) => {
  const validations = checkSchema(chemaValidation);
  try {
    //! run: Runs the current sanitization chain in an imperative way.
    //! and return Promise that resolves when the sanitization chain ran.
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    const validationErrorArray = errors.array({ onlyFirstError: true });

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ success: false, errors: validationErrorArray });
    }

    next();
  } catch (error) {
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
};
