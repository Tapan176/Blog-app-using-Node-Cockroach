/* eslint-disable prefer-destructuring */
const { ValidationError } = require('express-validation');
const errorMap = require('../constants/errorCodes');

module.exports = {
  errorHandler: (error, response) => {
    if (error instanceof ValidationError) {
      return response.status(error.statusCode).json(error);
    }

    const customError = errorMap[error.message] || 'Internal Server Error';
    console.error(customError);

    const statusCode = customError.statusCode || 500;

    response.status(statusCode).json({
      error: {
        code: customError.code,
        message: customError.message,
      },
    });
  },
};
