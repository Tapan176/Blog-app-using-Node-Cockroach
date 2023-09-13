const express = require('express');
const router = express.Router();

const controller = require('./user.controller');

const { authenticateUser, authenticateAdmin } = require('../middleware/passport');

/**
* @swagger
* tags:
*   name: Admin
*   description: Admin endpoints
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* /user/users:
*   get:
*     tags:
*       - Admin
*     summary: Get all users
*     responses:
*       '200':
*         $ref: 'components/user/responseContract.json#/successfulRetrievalOfAllUsers'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*   post:
*     tags:
*       - Admin
*     summary: Add a user
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/user/requestContract.json#/AddUser'
*     responses:
*       '200':
*         $ref: 'components/user/responseContract.json#/successfulAdditionOfUser'       
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '409':
*         $ref: 'components/errorContract.json#/userAlreadyExist'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/users')
        .get(authenticateAdmin, controller.getAllUserDetails)
        .post(authenticateAdmin, controller.createUser);

/**
* @swagger
* /user/users/email:
*   get:
*     tags:
*       - Admin
*     summary: Get user by email
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/user/requestContract.json#/GetUserByEmail'
*     responses:
*       '200':
*         $ref: 'components/user/responseContract.json#/successfulRetrievalOfUserByEmail'
*       '404':
*         $ref: 'components/errorContract.json#/userNotFound'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/users/email')
        .get(authenticateAdmin, controller.getUserDetailsByEmail);

/**
* @swagger
* /user/users/:id:
*   get:
*     tags:
*       - Admin
*     summary: Get user by ID
*     parameters:
*       - in: path
*         name: id
*         description: userId
*         required: true
*         schema:
*           type: integer
*     responses:
*       '200':
*         $ref: 'components/user/responseContract.json#/successfulRetrievalOfUserById'
*       '404':
*         $ref: 'components/errorContract.json#/userNotFound'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*   put:
*     tags:
*       - Admin
*     summary: Edit a user
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         description: userId
*         required: true
*         schema:
*           type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/user/requestContract.json#/UpdateUser'
*     responses:
*       '200':
*         $ref: 'components/user/responseContract.json#/successfulUpdationOfUser'
*       '400':
*         $ref: 'components/errorContract.json#/invalidRequest'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '404':
*         $ref: 'components/errorContract.json#/userNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*   delete:
*     tags:
*       - Admin
*     summary: Delete a user
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         description: userId
*         required: true
*         schema:
*           type: integer
*     responses:
*       '200':
*         $ref: 'components/user/responseContract.json#/successfulDeletionOfUser'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '404':
*         $ref: 'components/errorContract.json#/userNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/users/:id')
        .get(authenticateAdmin, controller.getUserDetailsById)
        .put(authenticateAdmin, controller.editUser)
        .delete(authenticateAdmin, controller.deleteUser);

/**
* @swagger
* tags:
*   name: User
*   description: User endpoints
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* /user/users/change-password:
*   put:
*     tags:
*       - User
*     summary: Change user's password
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/user/requestContract.json#/UpdateUserPassword'
*     responses:
*       '200':
*         $ref: 'components/user/responseContract.json#/successfulUpdationOfUserPassword'
*       '400':
*         $ref: 'components/errorContract.json#/invalidRequest'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/users/change-password')
        .put(authenticateUser, controller.changePassword);

/**
* @swagger
* /user/users/change-name:
*   put:
*     tags:
*       - User
*     summary: Change user's name
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/user/requestContract.json#/UpdateUserName'
*     responses:
*       '200':
*         $ref: 'components/user/responseContract.json#/successfulUpdationOfUserName'
*       '400':
*         $ref: 'components/errorContract.json#/invalidRequest'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/users/change-name')
        .put(authenticateUser, controller.changeName);

module.exports = router;