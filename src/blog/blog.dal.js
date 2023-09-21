/* eslint-disable no-const-assign */
module.exports = {
  selectAllArticles: async (dbClient, limit, offset) => {
    const sqlStmt = `
            SELECT * 
            FROM "articles"
            LIMIT $1
            OFFSET $2
            ;`;
    const parameters = [limit, offset];
    const queryResult = dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  selectArticleById: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT "article".*
                   ,"category"."title" AS "tag"
                   ,"user"."firstName"
                   ,"user"."lastName" 
                   ,"user"."email" 
                   ,"comment"."userId"
                   ,"comment"."comment"
                   ,"comment"."likes" As "commentLikes"
                   ,"comment"."dislikes" As "commentDislikes"
                   ,"comment"."reply"
                   ,"comment"."createdAt"
                   ,"comment"."updatedAt"
            FROM "articles" AS "article"
            JOIN "users" AS "user" 
            ON "article"."userId" = "user"."id"
            LEFT JOIN "comments" AS "comment" 
            ON "article"."id" = "comment"."articleId"
            LEFT JOIN "categories" AS "category" 
            ON "article"."categoryId" = "category"."id"
            WHERE "article"."id" = $1
            ;`;
    const parameters = [blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  selectArticlesByCategoryId: async (dbClient, blogData, limit, offset) => {
    const sqlStmt = `
            SELECT * 
            FROM "articles" 
            WHERE "categoryId" = $1
            LIMIT $2
            OFFSET $3
            ;`;
    const parameters = [blogData.categoryId, limit, offset];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  selectArticlesByUserId: async (dbClient, blogData, limit, offset) => {
    const sqlStmt = `
            SELECT * 
            FROM "articles" 
            WHERE "userId" = $1
            LIMIT $2
            OFFSET $3
            ;`;
    const parameters = [blogData.userId, limit, offset];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },

  selectUserIdByBlogId: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT "userId" 
            FROM "articles" 
            WHERE "id" = $1
            ;`;
    const parameters = [blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },

  insertArticle: async (dbClient, blogData) => {
    const sqlStmt = `
            INSERT INTO "articles" 
                (
                    "title"
                    ,"body"
                    ,"userId"
                    ,"categoryId"
                ) 
            VALUES 
                (
                    $1
                    ,$2
                    ,$3
                    ,$4
                );`;
    const parameters = [blogData.title, blogData.body, blogData.userId, blogData.categoryId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },

  updateArticle: async (dbClient, blogData) => {
    const sqlStmt = `
            UPDATE "articles" 
            SET "title" = $1
                ,"body" = $2
                ,"categoryId" = $3 
            WHERE "id" = $4
            ;`;
    const parameters = [blogData.title, blogData.body, blogData.categoryId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },

  deleteArticleById: async (dbClient, blogData) => {
    const sqlStmt = `
            DELETE FROM "articles" 
            WHERE "id" = $1
            ;`;
    const parameters = [blogData.title, blogData.userId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },

  selectArticleByTitleAndUserId: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT * 
            FROM "articles" 
            WHERE "title" = $1 AND "userId" = $2
            ;`;
    const parameters = [blogData.title, blogData.userId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },

  selectCategoriesByTitle: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT * 
            FROM "categories" 
            WHERE "title" = $1
            ;`;
    const parameters = [blogData.category];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },

  insertCategory: async (dbClient, blogData) => {
    const sqlStmt = `
            INSERT INTO "categories" 
                (
                    "title"
                ) 
            VALUES 
                (
                    $1
                );`;
    const parameters = [blogData.category];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  searchArticle: async (dbClient, blogData, limit, offset) => {
    const sqlStmt = `
            SELECT "article".*
            FROM "articles" "article"
            LEFT JOIN "users" "user" 
            ON "article"."userId" = "user"."id"
            WHERE "article"."title" ILIKE '%' || $1 || '%'
            OR "article"."body" ILIKE '%' || $1 || '%'
            OR "user"."firstName" ILIKE '%' || $1 || '%'
            OR "user"."lastName" ILIKE '%' || $1 || '%'
            LIMIT $2
            OFFSET $3
            ;`;
    const parameters = [blogData.searchString, limit, offset];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  getUserFromLikesTable: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT *
            FROM "likedBlog"
            WHERE "userId" = $1 AND "blogId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  getUserFromDislikesTable: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT *
            FROM "dislikedBlog"
            WHERE "userId" = $1 AND "blogId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  addLikeInLikesTable: async (dbClient, blogData) => {
    const sqlStmt = `
            INSERT INTO "likedBlog"
              (
                "userId"
                ,"blogId"
              )
            VALUES
              (
                $1
                ,$2
              )
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  removeLikeFromLikeTable: async (dbClient, blogData) => {
    const sqlStmt = `
            DELETE FROM "likedBlog"
            WHERE "userId" = $1 AND "blogId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  addDislikeInDislikeTable: async (dbClient, blogData) => {
    const sqlStmt = `
            INSERT INTO "dislikedBlog"
              (
                "userId"
                ,"blogId"
              )
            VALUES
              (
                $1
                ,$2
              )
              ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  removeDislikeFromDislikeTable: async (dbClient, blogData) => {
    const sqlStmt = `
            DELETE FROM "dislikedBlog"
            WHERE "userId" = $1 AND "blogId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  updateLikeInBlogTable: async (dbClient, blogData) => {
    const sqlStmt = `
            UPDATE "articles"
            SET "likes" = $1
            WHERE "id" = $2
            ;`;
    const parameters = [blogData.likes, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  updateDislikeInBlogTable: async (dbClient, blogData) => {
    const sqlStmt = `
            UPDATE "articles"
            SET "dislikes" = $1
            WHERE "id" = $2
            ;`;
    const parameters = [blogData.dislikes, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  countLikes: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT COUNT("userId")
            FROM "likedBlog"
            WHERE "blogId" = $1
            ;`;
    const parameters = [blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  countDislikes: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT COUNT("userId")
            FROM "dislikedBlog"
            WHERE "blogId" = $1
            ;`;
    const parameters = [blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  checkAuthorRating: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT *
            FROM "authorRatings"
            WHERE "userId" = $1 AND "authorId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.authorId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  rateAuthor: async (dbClient, blogData) => {
    const sqlStmt = `
            INSERT INTO "authorRatings"
              (
                "userId"
                ,"authorId"
                ,"rating"
              )
            VALUES
              (
                $1
                ,$2
                ,$3
              )
              ;`;
    const parameters = [blogData.userId, blogData.authorId, blogData.rating];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  updateAuthorRatings: async (dbClient, blogData) => {
    const sqlStmt = `
            UPDATE "authorRatings"
            SET "rating" = $1
            WHERE "userId" = $2 AND "authorId" = $3
            ;`;
    const parameters = [blogData.rating, blogData.userId, blogData.authorId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
};
