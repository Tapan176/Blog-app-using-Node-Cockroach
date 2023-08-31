const cockroachLib = require('../../cockroach');

module.exports = {
    getAllArticles: async () => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM articles`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getArticlesById: async (blogId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "id" = '${blogId}'`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    addArticle: async (title, body, category, userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const existingBlog = await dbClient.query(`SELECT * FROM articles WHERE "title" = '${title}' AND "userId" = '${userId}'`);

            if (existingBlog.rowCount > 0) {
                throw new Error('blog_already_exist');
            }

            const findCategoryId = await dbClient.query(`SELECT * FROM categories WHERE "title" = '${category}'`);
            let categoryId;
            if (findCategoryId.rowCount > 0) {
                categoryId = findCategoryId.rows[0].id;
            } else {
                const queryResult = await dbClient.query(`INSERT INTO categories ("title") VALUES ('${category}')`);
                categoryId = queryResult.rows[0].id;
            }

            const queryResult = await dbClient.query(`INSERT INTO articles ("title", "body", "userId", "categoryId") VALUES ('${title}', '${body}', '${userId}', '${categoryId}')`);
            
            return queryResult.rows[0];
        } finally {
            dbClient.release();
        }
    },
    editArticle: async (blogId, title, body, category, userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const selectedBlogUserId = await dbClient.query(`SELECT "userId" FROM articles WHERE "id" = '${blogId}'`);
            
            if (selectedBlogUserId.rows[0].userId != userId) {
                throw new Error('blog_not_authorized');
            }

            const findCategoryId = await dbClient.query(`SELECT * FROM categories WHERE "title" = '${category}'`);
            let categoryId;
            if (findCategoryId.rowCount > 0) {
                categoryId = findCategoryId.rows[0].id;
            } else {
                const queryResult = await dbClient.query(`INSERT INTO categories ("title") VALUES ('${category}')`);
                categoryId = queryResult.rows[0].id;
            }

            const queryResult = await dbClient.query(`UPDATE articles SET "title" = '${title}', 
                                                                          "body" = '${body}', 
                                                                          "userId" = '${userId}', 
                                                                          "categoryId" = '${categoryId}' 
                                                                           WHERE "id" = '${blogId}'`);
            
            return queryResult.rows[0];
        } finally {
            dbClient.release();
        }
    },
    deleteArticle: async (blogId, userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const selectedBlogUserId = await dbClient.query(`SELECT "userId" FROM articles WHERE "id" = '${blogId}'`);

            if (selectedBlogUserId.rows[0].userId != userId) {
                throw new Error('blog_not_authorized');
            }

            const queryResult = await dbClient.query(`DELETE FROM articles WHERE "id" = '${blogId}' AND "userId" = '${userId}'`)

            return queryResult.rows[0];
        } finally {
            dbClient.release();
        }
    },
    searchArticle: async (searchString) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT a.*
                                                      FROM articles a
                                                      LEFT JOIN users u ON a."userId" = u."id"
                                                      WHERE a."title" LIKE '%${searchString}%'
                                                      OR a."body" LIKE '%${searchString}%'
                                                      OR (u."firstName" LIKE '%${searchString}%' OR u."lastName" LIKE '%${searchString}%');`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    applyFiltersOnBlogs: async (categoryId, publishedAfter, totalLikes, totalDislikes) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if(categoryId){
                const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "categoryId" = '${categoryId}'`);
            } else if(publishedAfter){
                const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "createdAt" <= '${publishedAfter}'`);
            } else if(totalLikes){
                const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "likes" >= '${totalLikes}'`);
            } else if(totalDislikes){
                const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "dislikes" >= '${totalDislikes}'`);
            } else if(categoryId && publishedAfter){
                const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "createdAt" <= '${publishedAfter}'`);
            } else if(categoryId && totalLikes){
                const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "likes" >= '${totalLikes}'`);
            } else if(categoryId && totalDislikes){
                const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "dislikes" >= '${totalDislikes}'`);
            } else if(publishedAfter && totalLikes){
                const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "createdAt" <= '${publishedAfter}' AND "likes" >= '${totalLikes}'`);
            } 
        } finally {
            dbClient.release();
        }
    },
};