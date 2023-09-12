const { Joi } = require('express-validation');

const validationSchema = {
  email: Joi.string()
            .email()
            .pattern(/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(?:com|in)$/)
            .required(),
  password: Joi.string()
               .regex(/[a-zA-Z0-9@]{3,30}/)
               .required(),
  firstName: Joi.string().regex(/[a-zA-Z]{3,30}/).required(),
  lastName: Joi.string().regex(/[a-zA-Z]{3,30}/).required() 
};

module.exports = {
    login: {
        body: Joi.object({
          email: validationSchema.email,
          password: validationSchema.password,
        }),
    },
    signUp: {
        body: Joi.object({
          firstName: validationSchema.firstName,
          lastName: validationSchema.lastName,
          email: validationSchema.email,
          password: validationSchema.password,
          confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        }),
    },
    forgotPassword: {
        body: Joi.object({
          email: validationSchema.email,
        }),
    },
    resetPassword: {
        body: Joi.object({
          newPassword: validationSchema.password,
          confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
        }),
    },
};