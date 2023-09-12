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
            SELECT "a".* 
                   ,"t"."title" AS "category"
                   ,"u"."firstName"
                   ,"u"."lastName" 
                   ,"u"."email" 
                   ,"c".*
            FROM "articles" AS "a"
            JOIN "users" AS "u" 
            ON "a"."userId" = "u"."id"
            LEFT JOIN "comments" AS "c" 
            ON "a"."id" = "c"."articleId"
            LEFT JOIN "categories" AS "t" 
            ON "a"."categoryId" = "t"."id"
            WHERE "a"."id" = $1
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
            SELECT "a".*
            FROM "articles" "a"
            LEFT JOIN "users" "u" 
            ON "a"."userId" = "u"."id"
            WHERE "a"."title" LIKE $1
            OR "a"."body" LIKE $1
            OR "u"."firstName" LIKE $1
            OR "u"."lastName" LIKE $1
            ;`;
        const parameters = [blogData.searchString];
        const queryResult = await dbClient.query(sqlStmt, parameters);
        console.log(queryResult.rows);
        return queryResult;
    }
};
