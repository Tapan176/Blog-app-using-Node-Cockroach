const { ValidationError } = require('express-validation');
const errorMap = require('../constants/errorCodes');

module.exports = {
  errorHandler: (error, response) => {
    if (error instanceof ValidationError) {
      return response.status(error.statusCode).json(error);
    }

    const customError = errorMap[error.message];
    console.error(error);

    const { statusCode } = customError;

    response.status(statusCode).json({
      error: {
        code: customError.code,
        message: customError.message,
      },
    });
  },
};
