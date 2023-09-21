const { Joi } = require('express-validation');

const validationSchema = {
  title: Joi.string().required(),
  body: Joi.string().required(),
  category: Joi.string().required(),
  searchString: Joi.string().required(),
  userIdByAdmin: Joi.string(),
  blogId: Joi.string().required(),
  commentId: Joi.string().required(),
  categoryId: Joi.string().required(),
};

module.exports = {
  getArticlesById: {
    params: Joi.object({
      blogId: validationSchema.blogId,
    }),
  },
  getArticlesByCategory: {
    params: Joi.object({
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
    params: Joi.object({
      blogId: validationSchema.blogId,
    }),
    body: Joi.object({
      title: validationSchema.title,
      body: validationSchema.body,
      category: validationSchema.category,
    }),
  },
  deleteArticle: {
    params: Joi.object({
      blogId: validationSchema.blogId,
    }),
  },
  searchArticle: {
    body: Joi.object({
      searchString: validationSchema.searchString,
    }),
  },
};
