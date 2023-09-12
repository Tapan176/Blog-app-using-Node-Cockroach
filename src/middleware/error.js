const errorMap = require('../constants/errorCodes');
const { ValidationError } = require('express-validation');

module.exports = {
    errorHandler: (err, req, res, next) => {
        if (err instanceof ValidationError) {
            return res.status(err.statusCode).json(err);
        }

        const customError = errorMap[err.message];
        console.error(err);
    
        const statusCode = customError.statusCode;
    
        res.status(statusCode).json({
            error: {
                code: customError.code,
                message: customError.message,
            },
        });
    },
};