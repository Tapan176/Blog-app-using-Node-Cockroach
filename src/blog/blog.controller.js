const services = require('./blog.service');

module.exports = {
  getAllArticles: async (request, response, next) => {
    try {
      const responseBody = await services.getAllArticles();
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  getArticlesById: async (request, response, next) => {
    try {
      const { blogId } = request.params;
      const responseBody = await services.getArticlesById(blogId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  getArticlesByCategory: async (request, response, next) => {
    try {
      const { categoryId } = request.params;
      const responseBody = await services.getArticlesByCategory(categoryId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  getUserArticles: async (request, response, next) => {
    try {
      const { id: userId } = request.user;
      const responseBody = await services.getUserArticles(userId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  addArticle: async (request, response, next) => {
    try {
      const { id: userId, role: userRole } = request.user;
      const {
        title, body, category, userIdByAdmin,
      } = request.body;
      const responseBody = await services.addArticle(title, body, category, userIdByAdmin, userId, userRole);
      response.status(201).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  editArticle: async (request, response, next) => {
    try {
      const { id: userId, role: userRole } = request.user;
      const { blogId } = request.params;
      const { title, body, category } = request.body;
      const responseBody = await services.editArticle(blogId, title, body, category, userId, userRole);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  deleteArticle: async (request, response, next) => {
    try {
      const { id: userId, role: userRole } = request.user;
      const { blogId } = request.params;
      const responseBody = await services.deleteArticle(blogId, userId, userRole);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  searchArticle: async (request, response, next) => {
    try {
      const { searchString } = request.query;
      const responseBody = await services.searchArticle(searchString);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  likeArticle: async (request, response, next) => {
    try {
      const { id: userId } = request.user;
      const { blogId } = request.params;
      const responseBody = await services.likeArticle(userId, blogId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
  dislikeArticle: async (request, response, next) => {
    try {
      const { id: userId } = request.user;
      const { blogId } = request.params;
      const responseBody = await services.dislikeArticle(userId, blogId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  },
};
