const { Joi } = require('express-validation');

const validationSchema = {
  firstName: Joi.string().regex(/[a-zA-Z]{3,30}/).required(),
  lastName: Joi.string().regex(/[a-zA-Z]{3,30}/).required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+(?:com|in)$/)
    .required(),
  password: Joi.string()
    .regex(/[a-zA-Z0-9@]{3,30}/)
    .required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  isVerified: Joi.boolean().required(),
  userRole: Joi.string().valid('admin', 'user', 'author').required(),
  userId: Joi.number().integer().positive().required(),
};

module.exports = {
  createUser: {
    body: Joi.object({
      firstName: validationSchema.firstName,
      lastName: validationSchema.lastName,
      email: validationSchema.email,
      password: validationSchema.password,
      confirmPassword: validationSchema.confirmPassword,
      isVerified: validationSchema.isVerified,
      userRole: validationSchema.userRole,
    }),
  },
  editUser: {
    body: Joi.object({
      firstName: validationSchema.firstName,
      lastName: validationSchema.lastName,
      email: validationSchema.email,
      isVerified: validationSchema.isVerified,
      userRole: validationSchema.userRole,
    }),
  },
  changePassword: {
    body: Joi.object({
      oldPassword: validationSchema.password,
      newPassword: validationSchema.password,
      confirmNewPassword: validationSchema.confirmPassword,
    }),
  },
  changeName: {
    body: Joi.object({
      firstName: validationSchema.firstName,
      lastName: validationSchema.lastName,
    }),
  },
  getUserDetailsByEmail: {
    body: Joi.object({
      email: validationSchema.email,
    }),
  },
  deleteUser: {
    body: Joi.object({
      userId: validationSchema.userId,
    }),
  },
  getUserDetailsById: {
    body: Joi.object({
      userId: validationSchema.userId,
    }),
  },
};
