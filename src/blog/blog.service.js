/* eslint-disable eqeqeq */
const cockroachLib = require('../cockroach');
const dal = require('./blog.dal');

module.exports = {
  getAllArticles: async () => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectAllArticles(dbClient);
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
          likeS: row.likes,
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
  getArticlesByCategory: async (categoryId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectArticlesByCategoryId(dbClient, { categoryId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  getUserArticles: async (userId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.selectArticlesByUserId(dbClient, { userId });
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
  searchArticle: async (searchString) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const queryResult = await dal.searchArticle(dbClient, { searchString });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  likeArticle: async (userId, blogId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const checkUser = await dal.getUserFromLikesTable(dbClient, { userId });
      if (checkUser.rowCount == 0) {
        await dal.addUserInLikesTable(dbClient, { userId });
      }

      let likes = parseInt(((await dal.selectArticleById(dbClient, { blogId })).rows[0]).likes, 10);
      let dislikes = parseInt(((await dal.selectArticleById(dbClient, { blogId })).rows[0]).dislikes, 10);

      console.log(likes);

      let blogsLiked = checkUser.rows[0].blogsLiked || [];
      let blogsDisliked = checkUser.rows[0].blogsDisliked || [];

      console.log(typeof(blogsLiked));
      if (blogsLiked.length > 0) {
        let blogAlreadyLiked = blogsLiked.indexOf(blogId);
        let blogAlreadyDisliked = blogsDisliked.indexOf(blogId);

        if (blogAlreadyLiked) {
          likes -= 1;
          blogsLiked.splice(blogAlreadyLiked, 1);
          await dal.removeLikeInLikesTable(dbClient, { blogsLiked, userId });
          await dal.removeLikeInBlogTable(dbClient, { likes, blogId });
        }

        if (blogAlreadyDisliked) {
          dislikes -= 1;
          blogsDisliked.splice(blogAlreadyDisliked, 1);
          await dal.removeDislikeInLikesTable(dbClient, { blogsDisliked, userId });
          await dal.removeDislikeInBlogTable(dbClient, { dislikes, blogId });
        }

        likes += 1;
        blogsLiked.push(blogId);
      } else {
        likes += 1;
        blogsLiked.push(blogId);
      }

      console.log(likes, blogsLiked);
      await dal.addLikeInLikesTable(dbClient, { userId, blogId, blogsLiked });
      await dal.addLikeInBlogTable(dbClient, { likes, blogId });

      const queryResult = await dal.selectArticleById(dbClient, { userId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
  dislikeArticle: async (userId, blogId) => {
    const dbClient = await cockroachLib.dbCponnectionPool.connect();
    try {
      const checkUser = await dal.getUserFromLikesTable(dbClient, { userId });
      if (checkUser.rowCount == 0) {
        await dal.addUserInLikesTable(dbClient, { userId });
      }

      const blogAlreadyLiked = (checkUser.rows[0].blogsLiked).indexOf(blogId);
      const blogAlreadyDisliked = (checkUser.rows[0].blogsDisliked).indexOf(blogId);

      if (blogAlreadyLiked) {
        await dal.removeLikeInLikesTable(dbClient, { userId, blogId });
        await dal.removeLikeInBlogTable(dbClient, { blogId });
      }

      if (blogAlreadyDisliked) {
        await dal.removeDislikeInLikesTable(dbClient, { userId, blogId });
        await dal.removeDislikeInBlogTable(dbClient, { blogId });
      }

      await dal.addDislikeInLikesTable(dbClient, { userId, blogId });
      await dal.addDislikeInBlogTable(dbClient, { blogId });

      const queryResult = await dal.selectArticleById(dbClient, { userId });
      return queryResult.rows;
    } finally {
      dbClient.release();
    }
  },
};
