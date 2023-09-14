module.exports = {
  selectAllArticles: async (dbClient) => {
    const sqlStmt = `
            SELECT * 
            FROM "articles"
            ;`;
    const queryResult = dbClient.query(sqlStmt);
    return queryResult;
  },
  selectArticleById: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT "article".* 
                   ,"category"."title" AS "tag"
                   ,"user"."firstName"
                   ,"user"."lastName" 
                   ,"user"."email" 
                   ,"comment".*
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
  selectArticlesByCategoryId: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT * 
            FROM "articles" 
            WHERE "categoryId" = $1
            ;`;
    const parameters = [blogData.categoryId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  selectArticlesByUserId: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT * 
            FROM "articles" 
            WHERE "userId" = $1
            ;`;
    const parameters = [blogData.userId];
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
  searchArticle: async (dbClient, blogData) => {
    const sqlStmt = `
            SELECT "article".*
            FROM "articles" "article"
            LEFT JOIN "users" "user" 
            ON "article"."userId" = "user"."id"
            WHERE "article"."title" ILIKE '%' || $1 || '%'
            OR "article"."body" ILIKE '%' || $1 || '%'
            OR "user"."firstName" ILIKE '%' || $1 || '%'
            OR "user"."lastName" ILIKE '%' || $1 || '%'
            ;`;
    const parameters = [blogData.searchString];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
};
