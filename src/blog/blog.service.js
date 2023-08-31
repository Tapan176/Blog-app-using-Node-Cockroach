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
    deleteArticle: async () => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            
        } finally {
            dbClient.release();
        }
    },
    searchArticle: async () => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            
        } finally {
            dbClient.release();
        }
    },
    searchArticleByCategory: async () => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            
        } finally {
            dbClient.release();
        }
    },
};