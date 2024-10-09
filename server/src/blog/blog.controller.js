const services = require('./blog.service');

class Controller {
  async getAllArticles (request, response, next) {
    try {
      const { limit, page } = request.query;
      const responseBody = await services.getAllArticles(limit, page);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async getArticlesById (request, response, next) {
    try {
      const { blogId } = request.params;
      const responseBody = await services.getArticlesById(blogId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async getArticlesByCategory (request, response, next) {
    try {
      const { categoryId } = request.params;
      const { limit, page } = request.query;
      const responseBody = await services.getArticlesByCategory(categoryId, limit, page);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async getUserArticles (request, response, next) {
    try {
      const { id: userId } = request.user;
      const { limit, page } = request.query;
      const responseBody = await services.getUserArticles(userId, limit, page);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async addArticle (request, response, next) {
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
  }

  async editArticle (request, response, next) {
    try {
      const { id: userId, role: userRole } = request.user;
      const { blogId } = request.params;
      const { title, body, category } = request.body;
      const responseBody = await services.editArticle(blogId, title, body, category, userId, userRole);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async deleteArticle (request, response, next) {
    try {
      const { id: userId, role: userRole } = request.user;
      const { blogId } = request.params;
      const responseBody = await services.deleteArticle(blogId, userId, userRole);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async searchArticle (request, response, next) {
    try {
      const { searchString, limit, page } = request.body;
      const responseBody = await services.searchArticle(searchString, limit, page);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async likeArticle (request, response, next) {
    try {
      const { id: userId } = request.user;
      const { blogId } = request.params;
      const responseBody = await services.likeArticle(userId, blogId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async dislikeArticle (request, response, next) {
    try {
      const { id: userId } = request.user;
      const { blogId } = request.params;
      const responseBody = await services.dislikeArticle(userId, blogId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async rateAuthor (request, response, next) {
    try {
      const { id: userId } = request.user;
      const { blogId } = request.params;
      const requestBody = request.body;
      const responseBody = await services.rateAuthor(userId, blogId, requestBody);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async sendMessageToAuthor (request, response, next) {
    try {
      const { id: userId } = request.user;
      const { blogId } = request.params;
      const requestBody = request.body;
      const responseBody = await services.sendMessageToAuthor(userId, blogId, requestBody);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
