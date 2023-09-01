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
            const queryResult = await dbClient.query(`SELECT a.*, 
                                                             t.title AS "category",
                                                             u."firstName", 
                                                             u."lastName", 
                                                             u."email", 
                                                             c.*
                                                             FROM articles AS a
                                                             JOIN users AS u ON a."userId" = u."id"
                                                             LEFT JOIN comments AS c ON a."id" = c."articleId"
                                                             LEFT JOIN categories AS t ON a."categoryId" = t."id"
                                                             WHERE a."id" = '${blogId}'`);

            const blogPage = {
                                blogDetails: { 
                                                title: queryResult.rows[0].title, 
                                                body: queryResult.rows[0].body, 
                                                category: queryResult.rows[0].category, 
                                                createdAt: queryResult.rows[0].createdAt, 
                                                updatedAt: queryResult.rows[0].updatedAt,
                                                likes: queryResult.rows[0].likes,
                                                dislikes: queryResult.rows[0].dislikes
                                },
                                authorDetails: {
                                                fullName: queryResult.rows[0].firstName + " " + queryResult.rows[0].lastName,
                                                email: queryResult.rows[0].email
                                },
                                blogComments: queryResult.rows.map(row => ({
                                                                            userId: row.userId,
                                                                            comment: row.comment,
                                                                            likeS: row.likes,
                                                                            dislikes: row.dislikes,
                                                                            reply: row.reply,
                                                                            commentedAt: row.createdAt,
                                                                            editedAt: row.updatedAt
                                }))
            };

            return blogPage;
        } finally {
            dbClient.release();
        }
    },
    getArticlesByCategory: async (categoryId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "categoryId" = '${categoryId}'`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getUserArticles: async (userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM articles WHERE "userId" = '${userId}'`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    addArticle: async (title, body, category, userIdByAdmin, userId, userRole) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if(userRole == "admin") {
                const existingBlog = await dbClient.query(`SELECT * FROM articles WHERE "title" = '${title}' AND "userId" = '${userIdByAdmin}'`);

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

                const queryResult = await dbClient.query(`INSERT INTO articles ("title", "body", "userId", "categoryId") 
                                                                      VALUES ('${title}', '${body}', '${userIdByAdmin}', '${categoryId}')`);
                
                return queryResult.rows;
            } else {
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
                
                return queryResult.rows;
            }
        } finally {
            dbClient.release();
        }
    },
    editArticle: async (blogId, title, body, category, userId, userRole) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if(userRole == 'admin') {
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
                                                                            "categoryId" = '${categoryId}' 
                                                                            WHERE "id" = '${blogId}'`);
                
                return queryResult.rows[0];
            } else{
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
                                                                            "categoryId" = '${categoryId}' 
                                                                            WHERE "id" = '${blogId}'`);
                
                return queryResult.rows[0];
            }
        } finally {
            dbClient.release();
        }
    },
    deleteArticle: async (blogId, userId, userRole) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if(userRole == 'admin') {
                const queryResult = await dbClient.query(`DELETE FROM articles WHERE "id" = '${blogId}'`);

                return queryResult.rows[0];
            } else {
                const selectedBlogUserId = await dbClient.query(`SELECT "userId" FROM articles WHERE "id" = '${blogId}'`);

                if (selectedBlogUserId.rows[0].userId != userId) {
                    throw new Error('blog_not_authorized');
                }

                const queryResult = await dbClient.query(`DELETE FROM articles WHERE "id" = '${blogId}'`);

                return queryResult.rows[0];
            }
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
    // applyFiltersOnBlogs: async (categoryId, publishedAfter, totalLikes, totalDislikes) => {
    //     const dbClient = await cockroachLib.dbPool.connect();
    //     try {
    //         let query;
    //         if(categoryId){
    //             query = `SELECT * FROM articles WHERE "categoryId" = '${categoryId}'`
    //         }
    //         if(publishedAfter){
    //             query = `SELECT * FROM articles WHERE "createdAt" <= '${publishedAfter}'`
    //         }
    //         if(totalLikes){
    //             query = `SELECT * FROM articles WHERE "likes" >= '${totalLikes}'`
    //         }
    //         if(totalDislikes){
    //             query = `SELECT * FROM articles WHERE "dislikes" >= '${totalDislikes}'`
    //         }
    //         if(categoryId && publishedAfter){
    //             query = `SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "createdAt" <= '${publishedAfter}'`
    //         }
    //         if(categoryId && totalLikes){
    //             query = `SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "likes" >= '${totalLikes}'`
    //         }
    //         if(categoryId && totalDislikes){
    //             query = `SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "dislikes" >= '${totalDislikes}'`
    //         }
    //         if(publishedAfter && totalLikes){
    //             query = `SELECT * FROM articles WHERE "createdAt" <= '${publishedAfter}' AND "likes" >= '${totalLikes}'`
    //         }
    //         if(publishedAfter && totalDislikes){
    //             query = `SELECT * FROM articles WHERE "createdAt" <= '${publishedAfter}' AND "dislikes" >= '${totalDislikes}'`
    //         }
    //         if(totalLikes && totalDislikes){
    //             query = `SELECT * FROM articles WHERE "likes" >= '${totalLikes}' AND "dislikes" >= '${totalDislikes}'`
    //         }
    //         if(categoryId && publishedAfter && totalLikes){
    //             query = `SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "createdAt" <= '${publishedAfter}' AND "likes" >= '${totalLikes}'`
    //         }
    //         if(categoryId && publishedAfter && totalDislikes){
    //             query = `SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "createdAt" <= '${publishedAfter}' AND "dislikes" >= '${totalDislikes}'`
    //         }
    //         if(categoryId && totalLikes && totalDislikes){
    //             query = `SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "likes" >= '${totalLikes}' AND "dislikes" >= '${totalDislikes}'`
    //         }
    //         if(publishedAfter && totalLikes && totalDislikes){
    //             query = `SELECT * FROM articles WHERE "createdAt" <= '${publishedAfter}' AND "likes" >= '${totalLikes}' AND "dislikes" >= '${totalDislikes}'`
    //         }
    //         if(categoryId && publishedAfter && totalLikes && totalDislikes){
    //             query = `SELECT * FROM articles WHERE "categoryId" = '${categoryId}' AND "createdAt" <= '${publishedAfter}' AND "likes" >= '${totalLikes}' AND "dislikes" >= '${totalDislikes}'`
    //         }

    //         const queryResult = await dbClient.query(query);

    //         return queryResult.rows;
    //     } finally {
    //         dbClient.release();
    //     }
    // },
};