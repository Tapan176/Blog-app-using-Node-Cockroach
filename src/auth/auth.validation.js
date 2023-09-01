const { validate, Joi } = require('express-validation');

module.exports = {
    loginValidation: validate({
        body: Joi.object({
          email: Joi.string()
            .email()
            .pattern(/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(?:com|in)$/)
            .required(),
          password: Joi.string()
            .regex(/[a-zA-Z0-9@]{3,30}/)
            .required(),
        }),
    }),
    signUpValidation: validate({
        body: Joi.object({
          firstName: Joi.string().regex(/[a-zA-Z]{3,30}/).required(),
          lastName: Joi.string().regex(/[a-zA-Z]{3,30}/).required(),
          email: Joi.string()
            .email()
            .pattern(/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(?:com|in)$/)
            .required(),
          password: Joi.string()
            .regex(/[a-zA-Z0-9@]{3,30}/)
            .required(),
          confirmPassword: Joi.ref('password'),
        }),
    }),
    forgotPasswordValidation: validate({
        body: Joi.object({
          email: Joi.string()
            .email()
            .pattern(/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(?:com|in)$/)
            .required(),
        }),
    }),
    resetPasswordValidation: validate({
        body: Joi.object({
          newPassword: Joi.string().regex(/[a-zA-Z0-9@]{3,30}/).required(),
          confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
        }),
    }),
};