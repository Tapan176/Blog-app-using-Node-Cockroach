const express = require('express');
const router = express.Router();

const { getAllComments, addComment, editComment, deleteComment } = require('./comment.controller');
const { authenticateUser } = require('../middleware/passport');

router.get('/blogs/:blogId/comments', getAllComments);
router.post('/blogs/:blogId/comments', authenticateUser, addComment);
router.put('/blogs/:blogId/comments/:commentId', authenticateUser, editComment);
router.delete('/blogs/:blogId/comments/:commentId', authenticateUser, deleteComment);

module.exports = router ;