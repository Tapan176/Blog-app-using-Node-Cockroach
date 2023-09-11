const cockroachLib = require('../../cockroach');
const {
    selectAllArticles,
    selectArticleById,
    selectArticlesByCategoryId,
    selectArticlesByUserId,
    selectUserIdByBlogId,
    insertArticle,
    updateArticle,
    deleteArticleById,
    selectArticleByTitleAndUserId,
    selectCategoriesByTitle,
    insertCategory,
    searchArticle
} = require('./blog.query');

module.exports = {
    getAllArticles: async () => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(selectAllArticles);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getArticlesById: async (blogId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(selectArticleById, [blogId]);

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
            const queryResult = await dbClient.query(selectArticlesByCategoryId, [categoryId]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getUserArticles: async (userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(selectArticlesByUserId, [userId]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    addArticle: async (title, body, category, userIdByAdmin, userId, userRole) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if(userRole == "admin") {
                const existingBlog = await dbClient.query(selectArticleByTitleAndUserId, [title, userIdByAdmin]);

                if (existingBlog.rowCount > 0) {
                    throw new Error('blog_already_exist');
                }

                const findCategoryId = await dbClient.query(selectCategoriesByTitle, [category]);
                let categoryId;
                if (findCategoryId.rowCount > 0) {
                    categoryId = findCategoryId.rows[0].id;
                } else {
                    const queryResult = await dbClient.query(insertCategory, [category]);
                    categoryId = queryResult.rows[0].id;
                }

                const queryResult = await dbClient.query(insertArticle, [title, body, userIdByAdmin, categoryId]);
                
                return queryResult.rows;
            } else {
                const existingBlog = await dbClient.query(selectArticleByTitleAndUserId, [title, userId]);

                if (existingBlog.rowCount > 0) {
                    throw new Error('blog_already_exist');
                }

                const findCategoryId = await dbClient.query(selectCategoriesByTitle, [category]);
                let categoryId;
                if (findCategoryId.rowCount > 0) {
                    categoryId = findCategoryId.rows[0].id;
                } else {
                    const queryResult = await dbClient.query(insertCategory, [category]);
                    categoryId = queryResult.rows[0].id;
                }

                const queryResult = await dbClient.query(insertArticle,  [title, body, userId, categoryId]);
                
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
                const findCategoryId = await dbClient.query(selectCategoriesByTitle, [category]);
                let categoryId;
                if (findCategoryId.rowCount > 0) {
                    categoryId = findCategoryId.rows[0].id;
                } else {
                    const queryResult = await dbClient.query(insertCategory, [category]);
                    categoryId = queryResult.rows[0].id;
                }

                const queryResult = await dbClient.query(updateArticle, [title, body, categoryId, blogId]);
                
                return queryResult.rows[0];
            } else{
                const selectedBlogUserId = await dbClient.query(selectUserIdByBlogId, [blogId]);
            
                if (selectedBlogUserId.rows[0].userId != userId) {
                    throw new Error('blog_not_authorized');
                }

                const findCategoryId = await dbClient.query(selectCategoriesByTitle, [category]);
                let categoryId;
                if (findCategoryId.rowCount > 0) {
                    categoryId = findCategoryId.rows[0].id;
                } else {
                    const queryResult = await dbClient.query(insertCategory, [category]);
                    categoryId = queryResult.rows[0].id;
                }

                const queryResult = await dbClient.query(updateArticle, [title, body, categoryId, blogId]);
                
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
                const queryResult = await dbClient.query(deleteArticleById, [blogId]);

                return queryResult.rows[0];
            } else {
                const selectedBlogUserId = await dbClient.query(selectUserIdByBlogId, [blogId]);

                if (selectedBlogUserId.rows[0].userId != userId) {
                    throw new Error('blog_not_authorized');
                }

                const queryResult = await dbClient.query(deleteArticleById, [blogId]);

                return queryResult.rows[0];
            }
        } finally {
            dbClient.release();
        }
    },
    searchArticle: async (searchString) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(searchArticle, [searchString]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
};