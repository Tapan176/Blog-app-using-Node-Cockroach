const { Joi } = require('express-validation');

const validationSchema = {
  comment: Joi.string().required(),
  userIdByAdmin: Joi.string().required(),
  blogId: Joi.string().required().required(),
  commentId: Joi.string().required().required(),
};

module.exports = {
  getAllComments: {
    params: Joi.object({
      blogId: validationSchema.blogId,
    }),
  },
  addComment: {
    params: Joi.object({
      blogId: validationSchema.blogId,
    }),
    body: Joi.object({
      comment: validationSchema.comment,
      userIdByAdmin: validationSchema.userIdByAdmin,
    }),
  },
  editComment: {
    params: Joi.object({
      commentId: validationSchema.commentId,
    }),
    body: Joi.object({
      comment: validationSchema.comment,
    }),
  },
  deleteComment: {
    params: Joi.object({
      commentId: validationSchema.commentId,
    }),
  },
};
