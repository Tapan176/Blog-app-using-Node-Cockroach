const { Joi } = require('express-validation');

const validationSchema = {
  title: Joi.string().required(),
  body: Joi.string().required(),
  category: Joi.string().required(),
  searchString: Joi.string().required(),
  userIdByAdmin: Joi.number().integer().positive(),
  blogId: Joi.number().integer().positive().required(),
  commentId: Joi.number().integer().positive().required(),
  categoryId: Joi.number().integer().positive().required(),
};

module.exports = {
  getArticlesById: {
    body: Joi.object({
      blogId: validationSchema.blogId,
    }),
  },
  getArticlesByCategory: {
    body: Joi.object({
      categoryId: validationSchema.categoryId,
    }),
  },
  addArticle: {
    body: Joi.object({
      title: validationSchema.title,
      body: validationSchema.body,
      category: validationSchema.category,
      userIdByAdmin: validationSchema.userIdByAdmin,
    }),
  },
  editArticle: {
    body: Joi.object({
      blogId: validationSchema.blogId,
      title: validationSchema.title,
      body: validationSchema.body,
      category: validationSchema.category,
    }),
  },
  deleteArticle: {
    body: Joi.object({
      blogId: validationSchema.blogId,
    }),
  },
  searchArticle: {
    body: Joi.object({
      searchString: validationSchema.searchString,
    }),
  },
};
