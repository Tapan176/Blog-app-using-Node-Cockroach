/* eslint-disable eqeqeq */
const cockroachLib = require('../cockroach');
const dal = require('./blog.dal');
const userDal = require('../user/user.dal');
const helper = require('../utils/helper');

module.exports = {
  getAllArticles: async (limit, page) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (limit == null) {
        limit = 5;
      }
      if (page == null) {
        page = 1;
      }
      const offset = (page - 1) * limit;
      const queryResult = await dal.selectAllArticles(dbClient, limit, offset);
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  getArticlesById: async (blogId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectArticleById(dbClient, { blogId });

      const blogPage = {
        blogDetails: {
          title: queryResult.rows[0].title,
          body: queryResult.rows[0].body,
          category: queryResult.rows[0].tag,
          createdAt: queryResult.rows[0].createdAt,
          updatedAt: queryResult.rows[0].updatedAt,
          likes: queryResult.rows[0].likes,
          dislikes: queryResult.rows[0].dislikes,
        },
        authorDetails: {
          fullName: `${queryResult.rows[0].firstName} ${queryResult.rows[0].lastName}`,
          email: queryResult.rows[0].email,
        },
        blogComments: queryResult.rows.map((row) => ({
          userId: row.userId,
          comment: row.comment,
          likes: row.likes,
          dislikes: row.dislikes,
          reply: row.reply,
          commentedAt: row.createdAt,
          editedAt: row.updatedAt,
        })),
      };

      return blogPage;
    } finally {
      dbClient.release();
    }
  },
  getArticlesByCategory: async (categoryId, limit, page) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (limit == null) {
        limit = 5;
      }
      if (page == null) {
        page = 1;
      }
      const offset = (page - 1) * limit;
      const queryResult = await dal.selectArticlesByCategoryId(dbClient, { categoryId }, limit, offset);
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  getUserArticles: async (userId, limit, page) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (limit == null) {
        limit = 5;
      }
      if (page == null) {
        page = 1;
      }
      const offset = (page - 1) * limit;
      const queryResult = await dal.selectArticlesByUserId(dbClient, { userId }, limit, offset);
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  addArticle: async (title, body, category, userIdByAdmin, userId, userRole) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (userRole === 'admin') {
        const existingBlog = await dal.selectArticleByTitleAndUserId(
          dbClient,
          { title, userId: userIdByAdmin },
        );

        if (existingBlog.rowCount > 0) {
          throw new Error('blog_already_exist');
        }

        const findCategoryId = await dal.selectCategoriesByTitle(dbClient, { category });
        let categoryId;
        if (findCategoryId.rowCount > 0) {
          categoryId = findCategoryId.rows[0].id;
        } else {
          const queryResult = await dal.insertCategory(dbClient, { category });
          categoryId = queryResult.rows[0].id;
        }

        const queryResult = await dal.insertArticle(dbClient, {
          title, body, userId: userIdByAdmin, categoryId,
        });

        return queryResult.rows;
      }
      const existingBlog = await dal.selectArticleByTitleAndUserId(dbClient, { title, userId });

      if (existingBlog.rowCount > 0) {
        throw new Error('blog_already_exist');
      }

      const findCategoryId = await dal.selectCategoriesByTitle(dbClient, { category });
      let categoryId;
      if (findCategoryId.rowCount > 0) {
        categoryId = findCategoryId.rows[0].id;
      } else {
        const queryResult = await dal.insertCategory(dbClient, { category });
        categoryId = queryResult.rows[0].id;
      }

      const queryResult = await dal.insertArticle(dbClient, {
        title, body, userId, categoryId,
      });

      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  editArticle: async (blogId, title, body, category, userId, userRole) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (userRole === 'admin') {
        const findCategoryId = await dal.selectCategoriesByTitle(dbClient, { category });
        let categoryId;
        if (findCategoryId.rowCount > 0) {
          categoryId = findCategoryId.rows[0].id;
        } else {
          const queryResult = await dal.insertCategory(dbClient, { category });
          categoryId = queryResult.rows[0].id;
        }

        const queryResult = await dal.updateArticle(dbClient, {
          title, body, categoryId, blogId,
        });

        return queryResult.rows[0];
      }
      const selectedBlogUserId = await dal.selectUserIdByBlogId(dbClient, { blogId });

      if (selectedBlogUserId.rows[0].userId != userId) {
        throw new Error('blog_not_authorized');
      }

      const findCategoryId = await dal.selectCategoriesByTitle(dbClient, { category });
      let categoryId;
      if (findCategoryId.rowCount > 0) {
        categoryId = findCategoryId.rows[0].id;
      } else {
        const queryResult = await dal.insertCategory(dbClient, { category });
        categoryId = queryResult.rows[0].id;
      }

      const queryResult = await dal.updateArticle(dbClient, {
        title, body, categoryId, blogId,
      });

      return queryResult.rows[0];
    } finally {
      dbClient.release();
    }
  },
  deleteArticle: async (blogId, userId, userRole) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (userRole === 'admin') {
        const queryResult = await dal.deleteArticleById(dbClient, { blogId });

        return queryResult.rows[0];
      }
      const selectedBlogUserId = await dal.selectUserIdByBlogId(dbClient, { blogId });

      if (selectedBlogUserId.rows[0].userId != userId) {
        throw new Error('blog_not_authorized');
      }

      const queryResult = await dal.deleteArticleById(dbClient, { blogId });

      return queryResult.rows[0];
    } finally {
      dbClient.release();
    }
  },
  searchArticle: async (searchString, limit, page) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      if (limit == null) {
        limit = 5;
      }
      if (page == null) {
        page = 1;
      }
      const offset = (page - 1) * limit;
      const queryResult = await dal.searchArticle(dbClient, { searchString }, limit, offset);
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  likeArticle: async (userId, blogId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const userAlreadyLiked = await dal.getUserFromLikesTable(dbClient, { userId, blogId });
      const userAlreadyDisliked = await dal.getUserFromDislikesTable(dbClient, { userId, blogId });

      if (userAlreadyLiked.rowCount == 0 && userAlreadyDisliked.rowCount == 0) {
        await dal.addLikeInLikesTable(dbClient, { userId, blogId });
      }

      if (userAlreadyLiked.rowCount > 0) {
        await dal.removeLikeFromLikeTable(dbClient, { userId, blogId });
      }

      if (userAlreadyDisliked.rowCount > 0) {
        await dal.removeDislikeFromDislikeTable(dbClient, { userId, blogId });
        await dal.addLikeInLikesTable(dbClient, { userId, blogId });
      }

      const likes = ((await dal.countLikes(dbClient, { blogId })).rows[0]).count;
      const dislikes = ((await dal.countDislikes(dbClient, { blogId })).rows[0]).count;

      await dal.updateLikeInBlogTable(dbClient, { likes, blogId });
      await dal.updateDislikeInBlogTable(dbClient, { dislikes, blogId });

      const queryResult = await dal.selectArticleById(dbClient, { blogId });

      const blogPage = {
        blogDetails: {
          title: queryResult.rows[0].title,
          body: queryResult.rows[0].body,
          category: queryResult.rows[0].tag,
          createdAt: queryResult.rows[0].createdAt,
          updatedAt: queryResult.rows[0].updatedAt,
          likes: queryResult.rows[0].likes,
          dislikes: queryResult.rows[0].dislikes,
        },
        authorDetails: {
          fullName: `${queryResult.rows[0].firstName} ${queryResult.rows[0].lastName}`,
          email: queryResult.rows[0].email,
        },
        blogComments: queryResult.rows.map((row) => ({
          userId: row.userId,
          comment: row.comment,
          likes: row.likes,
          dislikes: row.dislikes,
          reply: row.reply,
          commentedAt: row.createdAt,
          editedAt: row.updatedAt,
        })),
      };

      return blogPage;
    } finally {
      dbClient.release();
    }
  },
  dislikeArticle: async (userId, blogId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const userAlreadyLiked = await dal.getUserFromLikesTable(dbClient, { userId, blogId });
      const userAlreadyDisliked = await dal.getUserFromDislikesTable(dbClient, { userId, blogId });

      if (userAlreadyLiked.rowCount == 0 && userAlreadyDisliked.rowCount == 0) {
        await dal.addDislikeInDislikeTable(dbClient, { userId, blogId });
      }

      if (userAlreadyDisliked.rowCount > 0) {
        await dal.removeDislikeFromDislikeTable(dbClient, { userId, blogId });
      }

      if (userAlreadyLiked.rowCount > 0) {
        await dal.removeLikeFromLikeTable(dbClient, { userId, blogId });
        await dal.addDislikeInDislikeTable(dbClient, { userId, blogId });
      }

      const likes = ((await dal.countLikes(dbClient, { blogId })).rows[0]).count;
      const dislikes = ((await dal.countDislikes(dbClient, { blogId })).rows[0]).count;

      await dal.updateLikeInBlogTable(dbClient, { likes, blogId });
      await dal.updateDislikeInBlogTable(dbClient, { dislikes, blogId });

      const queryResult = await dal.selectArticleById(dbClient, { blogId });

      const blogPage = {
        blogDetails: {
          title: queryResult.rows[0].title,
          body: queryResult.rows[0].body,
          category: queryResult.rows[0].tag,
          createdAt: queryResult.rows[0].createdAt,
          updatedAt: queryResult.rows[0].updatedAt,
          likes: queryResult.rows[0].likes,
          dislikes: queryResult.rows[0].dislikes,
        },
        authorDetails: {
          fullName: `${queryResult.rows[0].firstName} ${queryResult.rows[0].lastName}`,
          email: queryResult.rows[0].email,
        },
        blogComments: queryResult.rows.map((row) => ({
          userId: row.userId,
          comment: row.comment,
          likes: row.likes,
          dislikes: row.dislikes,
          reply: row.reply,
          commentedAt: row.createdAt,
          editedAt: row.updatedAt,
        })),
      };

      return blogPage;
    } finally {
      dbClient.release();
    }
  },
  rateAuthor: async (userId, blogId, requestBody) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const authorId = ((await dal.selectUserIdByBlogId(dbClient, { blogId })).rows[0]).userId;
      const checkAuthorRating = await dal.checkAuthorRating(dbClient, { userId, authorId });
      let queryResult;
      if (checkAuthorRating.rowCount == 0) {
        queryResult = await dal.rateAuthor(dbClient, { userId, authorId, rating: requestBody.rating });
      }
      queryResult = await dal.updateAuthorRatings(dbClient, { rating: requestBody.rating, userId, authorId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  sendMessageToAuthor: async (userId, blogId, requestBody) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const authorId = ((await dal.selectUserIdByBlogId(dbClient, { blogId })).rows[0]).userId;
      const authorEmail = ((await userDal.selectUserById(dbClient, { userId: authorId })).rows[0]).email;
      const { firstName, lastName } = (await userDal.selectUserById(dbClient, { userId })).rows[0];
      const emailSubject = `${firstName} ${lastName} sent you a message.`;
      const emailBody = `${requestBody.message}`;
      await helper.sendEmail(authorEmail, emailSubject, emailBody);
    } finally {
      dbClient.release();
    }
  },
};
