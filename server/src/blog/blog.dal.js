/* eslint-disable no-const-assign */
class Dal {
  async selectAllArticles (dbClient, limit, offset) {
    const sqlStmt = `
            SELECT * 
            FROM "articles"
            LIMIT $1
            OFFSET $2
            ;`;
    const parameters = [limit, offset];
    const queryResult = dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async selectArticleById (dbClient, blogData) {
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
  }

  async selectArticlesByCategoryId (dbClient, blogData, limit, offset) {
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
  }
  async selectArticlesByUserId (dbClient, blogData, limit, offset) {
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
  }

  async selectUserIdByBlogId (dbClient, blogData) {
    const sqlStmt = `
            SELECT "userId" 
            FROM "articles" 
            WHERE "id" = $1
            ;`;
    const parameters = [blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async insertArticle (dbClient, blogData) {
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
  }

  async updateArticle (dbClient, blogData) {
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
  }

  async deleteArticleById (dbClient, blogData) {
    const sqlStmt = `
            DELETE FROM "articles" 
            WHERE "id" = $1
            ;`;
    const parameters = [blogData.title, blogData.userId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async selectArticleByTitleAndUserId (dbClient, blogData) {
    const sqlStmt = `
            SELECT * 
            FROM "articles" 
            WHERE "title" = $1 AND "userId" = $2
            ;`;
    const parameters = [blogData.title, blogData.userId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async selectCategoriesByTitle (dbClient, blogData) {
    const sqlStmt = `
            SELECT * 
            FROM "categories" 
            WHERE "title" = $1
            ;`;
    const parameters = [blogData.category];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async insertCategory (dbClient, blogData) {
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
  }

  async searchArticle (dbClient, blogData, limit, offset) {
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
  }

  async getUserFromLikesTable (dbClient, blogData) {
    const sqlStmt = `
            SELECT *
            FROM "likedBlog"
            WHERE "userId" = $1 AND "blogId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async getUserFromDislikesTable (dbClient, blogData) {
    const sqlStmt = `
            SELECT *
            FROM "dislikedBlog"
            WHERE "userId" = $1 AND "blogId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async addLikeInLikesTable (dbClient, blogData) {
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
  }

  async removeLikeFromLikeTable (dbClient, blogData) {
    const sqlStmt = `
            DELETE FROM "likedBlog"
            WHERE "userId" = $1 AND "blogId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async addDislikeInDislikeTable (dbClient, blogData) {
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
  }

  async removeDislikeFromDislikeTable (dbClient, blogData) {
    const sqlStmt = `
            DELETE FROM "dislikedBlog"
            WHERE "userId" = $1 AND "blogId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async updateLikeInBlogTable (dbClient, blogData) {
    const sqlStmt = `
            UPDATE "articles"
            SET "likes" = $1
            WHERE "id" = $2
            ;`;
    const parameters = [blogData.likes, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async updateDislikeInBlogTable (dbClient, blogData) {
    const sqlStmt = `
            UPDATE "articles"
            SET "dislikes" = $1
            WHERE "id" = $2
            ;`;
    const parameters = [blogData.dislikes, blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async countLikes (dbClient, blogData) {
    const sqlStmt = `
            SELECT COUNT("userId")
            FROM "likedBlog"
            WHERE "blogId" = $1
            ;`;
    const parameters = [blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async countDislikes (dbClient, blogData) {
    const sqlStmt = `
            SELECT COUNT("userId")
            FROM "dislikedBlog"
            WHERE "blogId" = $1
            ;`;
    const parameters = [blogData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async checkAuthorRating (dbClient, blogData) {
    const sqlStmt = `
            SELECT *
            FROM "authorRatings"
            WHERE "userId" = $1 AND "authorId" = $2
            ;`;
    const parameters = [blogData.userId, blogData.authorId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }

  async rateAuthor (dbClient, blogData) {
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
  }

  async updateAuthorRatings (dbClient, blogData) {
    const sqlStmt = `
            UPDATE "authorRatings"
            SET "rating" = $1
            WHERE "userId" = $2 AND "authorId" = $3
            ;`;
    const parameters = [blogData.rating, blogData.userId, blogData.authorId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  }
}

module.exports = new Dal();
