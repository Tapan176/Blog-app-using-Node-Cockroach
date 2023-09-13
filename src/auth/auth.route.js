const express = require('express');
const router = express.Router();
const { validate } = require('express-validation');

const controller = require('./auth.controller');
const { verifyJwtToken } = require('../middleware/passport');
const validation = require('./auth.validation');

/**
* @swagger
* tags:
*   name: Authentication
*   description: User authentication endpoints
*/

/**
* @swagger
* /auth/login:
*   post:
*     tags:
*       - Authentication
*     summary: User login
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/auth/requestContract.json#/UserLogin'
*     responses:
*       '204':
*         $ref: 'components/auth/responseContract.json#/successfulLogin'
*       '401':
*         $ref: 'components/errorContract.json#/incorrectPassword'
*       '500':
*         $ref: 'components/errorContract.json#/authenticationFailed'
*/
router.route('/login')
        .post(validate(validation.login), controller.login);

/**
* @swagger
* /auth/signup:
*   post:
*     tags:
*       - Authentication
*     summary: User signup
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/auth/requestContract.json#/UserSignUp'
*     responses:
*       '201':
*         $ref: 'components/auth/responseContract.json#/successfulSignup'
*       '409':
*         $ref: 'components/errorContract.json#/userAlreadyExists'
*       '400':
*         $ref: 'components/errorContract.json#/passwordAndConfirmPasswordDoNotMatch'
*       '500':
*         $ref: 'components/errorContract.json#/failedToRegisterUser'
*/
router.route('/signup')
        .post(validate(validation.signUp), controller.signup);

/**
* @swagger
* /auth/logout:
*   post:
*     tags:
*       - Authentication
*     summary: User logout
*     responses:
*       '204':
*         $ref: 'components/auth/responseContract.json#/successfulLogout'
*       '400':
*         $ref: 'components/errorContract.json#/userHasNotLogin'
*       '500':
*         $ref: 'components/errorContract.json#/logoutFailed'
*/
router.route('/logout')
        .post(controller.logout);

/**
* @swagger
* /auth/forgot-password:
*   post:
*     tags:
*       - Authentication
*     summary: Forgot password
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/auth/requestContract.json#/ForgotPassword'
*     responses:
*       '200':
*         $ref: 'components/auth/responseContract.json#/passwordResetEmailSent'
*       '404':
*         $ref: 'components/errorContract.json#/userNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/forgot-password')
        .post(validate(validation.forgotPassword), controller.forgotPassword);

/**
* @swagger
* /auth/reset-password:
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
*             $ref: 'components/auth/requestContract.json#/ResetPassword'
*     responses:
*       '200':
*         $ref: 'components/auth/responseContract.json#/passwordResetSuccessful'
*       '404':
*         $ref: 'components/errorContract.json#/userNotFound'
*       '400':
*         $ref: 'components/errorContract.json#/badRequest'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/reset-password')
        .post(verifyJwtToken, validate(validation.resetPassword), controller.resetPassword);

module.exports = router;