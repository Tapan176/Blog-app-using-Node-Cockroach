const errorMap = require('../constants/errorCodes');
const { ValidationError } = require('express-validation');

module.exports = {
    errorHandler: (err, req, res, next) => {
        const customError = errorMap[err.message];
        console.error(err);
    
        const statusCode = customError ? customError.statusCode : err.statusCode;

        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json(err);
        }
    
        res.status(statusCode).json({
            error: {
                code: customError ? customError.code : err.code,
                message: customError ? customError.message : err.message,
            },
        });
    },
};