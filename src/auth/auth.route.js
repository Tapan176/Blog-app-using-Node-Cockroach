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

  /**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

  /**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       '204':
 *         $ref: '#/components/responses/successfulLogin'
 *       '401':
 *         $ref: '#/components/responses/incorrectPassword'
 *       '500':
 *         $ref: '#/components/responses/authenticationFailed'
 */
router.post('/login', loginValidation, login);

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUp'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/successfulSignup'
 *       '409':
 *         $ref: '#/components/responses/userAlreadyExists'
 *       '400':
 *         $ref: '#/components/responses/passwordAndConfirmPasswordDoNotMatch'
 *       '500':
 *         $ref: '#/components/responses/failedToRegisterUser'
 */
router.post('/signUp', signUpValidation, signUp);

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     responses:
 *       '204':
 *         $ref: '#/components/responses/successfulLogout'
 *       '400':
 *         $ref: '#/components/responses/userHasNotLogin'
 *       '500':
 *         $ref: '#/components/responses/logoutFailed'
 */
router.post('/logout', logout);

/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/passwordResetEmailSent'
 *       '404':
 *         $ref: '#/components/responses/userNotFound'
 *       '500':
 *         $ref: '#/components/responses/internalServerError'
 */
router.post('/forgotPassword', forgotPasswordValidation, forgotPassword);

/**
 * @swagger
 * /resetPassword:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/passwordResetSuccessful'
 *       '404':
 *         $ref: '#/components/responses/userNotFound'
 *       '400':
 *         $ref: '#/components/responses/badRequest'
 *       '500':
 *         $ref: '#/components/responses/internalServerError'
 */
router.post('/resetPassword', verifyJwtToken, resetPasswordValidation, resetPassword);

module.exports = router;