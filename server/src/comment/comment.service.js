/* eslint-disable eqeqeq */
const cockroachLib = require('../cockroach');
const dal = require('./comment.dal');

class Service {
  async getAllComments (blogId) {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectCommentsByArticleId(dbClient, { blogId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  }

  async addComment (blogId, userIdByAdmin, userId, comment, userRole) {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (userRole === 'admin') {
        const queryResult = await dal.insertComment(dbClient, { blogId, userId: userIdByAdmin, comment });
        return queryResult.rows;
      }
      const queryResult = await dal.insertComment(dbClient, { blogId, userId, comment });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  }

  async editComment (commentId, userId, comment, userRole) {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (userRole === 'admin') {
        const queryResult = await dal.updateComment(dbClient, { comment, commentId });
        return queryResult.rows;
      }
      const selectedBlogUserId = await dal.selectUserIdByCommentId(dbClient, { commentId });

      if (selectedBlogUserId.rows[0].userId != userId) {
        throw new Error('comment_not_authorized');
      }
      const queryResult = await dal.updateComment(dbClient, { comment, commentId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  }

  async deleteComment (commentId, userId, userRole) {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (userRole === 'admin') {
        const queryResult = await dal.deleteCommentById(dbClient, { commentId });
        return queryResult.rows;
      }
      const selectedBlogUserId = await dal.selectUserIdByCommentId(dbClient, { commentId });

      if (selectedBlogUserId.rows[0].userId != userId) {
        throw new Error('comment_not_authorized');
      }
      const queryResult = await dal.deleteCommentById(dbClient, { commentId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  }
}

module.exports = new Service();
