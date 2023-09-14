const { Joi } = require('express-validation');

const validationSchema = {
  comment: Joi.string().required(),
  userIdByAdmin: Joi.number().integer().positive(),
  blogId: Joi.number().integer().positive().required(),
  commentId: Joi.number().integer().positive().required(),
};

module.exports = {
  getAllComments: {
    body: Joi.object({
      blogId: validationSchema.blogId,
    }),
  },
  addComment: {
    body: Joi.object({
      blogId: validationSchema.blogId,
      comment: validationSchema.comment,
      userIdByAdmin: validationSchema.userIdByAdmin,
    }),
  },
  editComment: {
    body: Joi.object({
      commentId: validationSchema.commentId,
      comment: validationSchema.comment,
    }),
  },
  deleteComment: {
    body: Joi.object({
      commentId: validationSchema.commentId,
    }),
  },
};
