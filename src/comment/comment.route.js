const express = require('express');
const router = express.Router();

const controller = require('./comment.controller');
const { authenticateUser } = require('../middleware/passport');

router.route('/blogs/:blogId/comments')
        .get(controller.getAllComments)
        .post(authenticateUser, controller.addComment);
router.route('/blogs/:blogId/comments/:commentId') 
        .put(authenticateUser, controller.editComment)
        .delete(authenticateUser, controller.deleteComment);

module.exports = router ;