const express = require('express');
const router = express.Router();

const { getAllComments, addComment, editComment, deleteComment } = require('./comment.controller');
const { authenticateUser } = require('../middleware/passport');

router.route('/blogs/:blogId/comments')
        .get(getAllComments)
        .post(authenticateUser, addComment);
router.route('/blogs/:blogId/comments/:commentId') 
        .put(authenticateUser, editComment)
        .delete(authenticateUser, deleteComment);

module.exports = router ;