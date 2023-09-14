const express = require('express');

const router = express.Router();

const controller = require('./comment.controller');
const { authenticateUser } = require('../middleware/passport');

/**
* @swagger
* tags:
*   name: Comment
*   description: Comment endpoints
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
* /comment/blogs/:blogId/comments:
*   get:
*     tags:
*       - Comment
*     summary: Get all comments
*     parameters:
*       - in: path
*         name: blogId
*         required: true
*         schema:
*           type: integer
*     responses:
*       '200':
*         $ref: 'components/comment/responseContract.json#/successfulRetrievalOfComments'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*   post:
*     tags:
*       - Comment
*     summary: Add a comment
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: blogId
*         required: true
*         schema:
*           type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/comment/requestContract.json#/AddComment'
*     responses:
*       '200':
*         $ref: 'components/comment/responseContract.json#/successfulAdditionToComment'
*       '400':
*         $ref: 'components/errorContract.json#/invalidRequest'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/blogs/:blogId/comments')
  .get(controller.getAllComments)
  .post(authenticateUser, controller.addComment);

/**
* @swagger
* /comment/blogs/:blogId/comments/:commentId:
*   put:
*     tags:
*       - Comment
*     summary: Edit a comment
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: blogId
*         required: true
*         schema:
*           type: integer
*       - in: path
*         name: commentId
*         required: true
*         schema:
*           type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/comment/requestContract.json#/AddComment'
*     responses:
*       '200':
*         $ref: 'components/comment/responseContract.json#/successfulUpdationOfComment'
*       '400':
*         $ref: 'components/errorContract.json#/invalidRequest'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '404':
*         $ref: 'components/errorContract.json#/commentNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*   delete:
*     tags:
*       - Comment
*     summary: Delete a comment
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: blogId
*         required: true
*         schema:
*           type: integer
*       - in: path
*         name: commentId
*         required: true
*         schema:
*           type: integer
*     responses:
*       '200':
*         $ref: 'components/comment/responseContract.json#/successfulDeletionOfComment'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '404':
*         $ref: 'components/errorContract.json#/commentNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/blogs/:blogId/comments/:commentId')
  .put(authenticateUser, controller.editComment)
  .delete(authenticateUser, controller.deleteComment);

module.exports = router;
