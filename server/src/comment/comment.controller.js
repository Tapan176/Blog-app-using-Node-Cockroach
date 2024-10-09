const services = require('./comment.service');

class Controller {
  async getAllComments (request, response, next) {
    try {
      const { blogId } = request.params;
      const responseBody = await services.getAllComments(blogId);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async addComment (request, response, next) {
    try {
      const { blogId } = request.params;
      const { id: userId, role: userRole } = request.user;
      const { comment, userIdByAdmin } = request.body;
      const responseBody = await services.addComment(
        blogId,
        userIdByAdmin,
        userId,
        comment,
        userRole,
      );
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async editComment (request, response, next) {
    try {
      const { commentId } = request.params;
      const { id: userId, role: userRole } = request.user;
      const { comment } = request.body;
      const responseBody = await services.editComment(commentId, userId, comment, userRole);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment (request, response, next) {
    try {
      const { commentId } = request.params;
      const { id: userId, role: userRole } = request.user;
      const responseBody = await services.deleteComment(commentId, userId, userRole);
      response.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Controller();
