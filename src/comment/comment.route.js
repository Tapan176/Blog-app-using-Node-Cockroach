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
* /comment/blogs/:blogId/comments:
*   get:
*     tags:
*       - Comment
*     summary: Get all comments
*   post:
*     tags:
*       - Comment
*     summary: Add a comment
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
*   delete:
*     tags:
*       - Comment
*     summary: Delete a comment
*/
router.route('/blogs/:blogId/comments/:commentId') 
        .put(authenticateUser, controller.editComment)
        .delete(authenticateUser, controller.deleteComment);

module.exports = router ;