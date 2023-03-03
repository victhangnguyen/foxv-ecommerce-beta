import { validationResult, checkSchema } from 'express-validator';

export const validateSchema = (chemaValidation) => async (req, res, next) => {
  const validations = checkSchema(chemaValidation);
  try {
    //! run: Runs the current sanitization chain in an imperative way.
    //! and return Promise that resolves when the sanitization chain ran.
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    console.log(
      '__Debugger__validateSchema\n__validate__errors: ',
      errors,
      '\n'
    );

    if (!errors.isEmpty()) {
      return (
        res
          .status(422)
          // .json({ errors: errors.array() });
          .json({ errors: errors.array({ onlyFirstError: true }) })
      );
    }

    //! success: true
    next();
  } catch (error) {
    console.log('Error: ', error);
    //! error Server => next(error)
  }
};
