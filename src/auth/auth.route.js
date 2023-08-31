const express = require('express');
const router = express.Router();

const { login, signUp, logout, forgotPassword, resetPassword } = require('./auth.controller');
const { verifyJwtToken } = require('../middleware/passport');
const {
    loginValidation,
    signUpValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
  } = require('./auth.validation');

router.post('/login', loginValidation, login);
router.post('/signUp', signUpValidation, signUp);
router.post('/logout', logout);
router.post('/forgotPassword', forgotPasswordValidation, forgotPassword);
router.post('/resetPassword', verifyJwtToken, resetPasswordValidation, resetPassword);

module.exports = router;