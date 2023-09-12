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
            const queryResult = await dal.selectArticleById(dbClient, [blogId]);

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
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
            const queryResult = await dal.selectArticlesByCategoryId(dbClient, [categoryId]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    getUserArticles: async (userId) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
            const queryResult = await dal.selectArticlesByUserId(dbClient, [userId]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    addArticle: async (title, body, category, userIdByAdmin, userId, userRole) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
            if(userRole == "admin") {
                const existingBlog = await dal.selectArticleByTitleAndUserId(dbClient, [title, userIdByAdmin]);

                if (existingBlog.rowCount > 0) {
                    throw new Error('blog_already_exist');
                }

                const findCategoryId = await dal.selectCategoriesByTitle(dbClient, [category]);
                let categoryId;
                if (findCategoryId.rowCount > 0) {
                    categoryId = findCategoryId.rows[0].id;
                } else {
                    const queryResult = await dal.insertCategory(dbClient, [category]);
                    categoryId = queryResult.rows[0].id;
                }

                const queryResult = await dal.insertArticle(dbClient, [title, body, userIdByAdmin, categoryId]);
                
                return queryResult.rows;
            } else {
                const existingBlog = await dal.selectArticleByTitleAndUserId(dbClient, [title, userId]);

                if (existingBlog.rowCount > 0) {
                    throw new Error('blog_already_exist');
                }

                const findCategoryId = await dal.selectCategoriesByTitle(dbClient, [category]);
                let categoryId;
                if (findCategoryId.rowCount > 0) {
                    categoryId = findCategoryId.rows[0].id;
                } else {
                    const queryResult = await dal.insertCategory(dbClient, [category]);
                    categoryId = queryResult.rows[0].id;
                }

                const queryResult = await dal.insertArticle(dbClient,  [title, body, userId, categoryId]);
                
                return queryResult.rows;
            }
        } finally {
            dbClient.release();
        }
    },
    editArticle: async (blogId, title, body, category, userId, userRole) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
            if(userRole == 'admin') {
                const findCategoryId = await dal.selectCategoriesByTitle(dbClient, [category]);
                let categoryId;
                if (findCategoryId.rowCount > 0) {
                    categoryId = findCategoryId.rows[0].id;
                } else {
                    const queryResult = await dal.insertCategory(dbClient, [category]);
                    categoryId = queryResult.rows[0].id;
                }

                const queryResult = await dal.updateArticle(dbClient, [title, body, categoryId, blogId]);
                
                return queryResult.rows[0];
            } else{
                const selectedBlogUserId = await dal.selectUserIdByBlogId(dbClient, [blogId]);
            
                if (selectedBlogUserId.rows[0].userId != userId) {
                    throw new Error('blog_not_authorized');
                }

                const findCategoryId = await dal.selectCategoriesByTitle(dbClient, [category]);
                let categoryId;
                if (findCategoryId.rowCount > 0) {
                    categoryId = findCategoryId.rows[0].id;
                } else {
                    const queryResult = await dal.insertCategory(dbClient, [category]);
                    categoryId = queryResult.rows[0].id;
                }

                const queryResult = await dal.updateArticle(dbClient, [title, body, categoryId, blogId]);
                
                return queryResult.rows[0];
            }
        } finally {
            dbClient.release();
        }
    },
    deleteArticle: async (blogId, userId, userRole) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
            if(userRole == 'admin') {
                const queryResult = await dal.deleteArticleById(dbClient, [blogId]);

                return queryResult.rows[0];
            } else {
                const selectedBlogUserId = await dal.selectUserIdByBlogId(dbClient, [blogId]);

                if (selectedBlogUserId.rows[0].userId != userId) {
                    throw new Error('blog_not_authorized');
                }

                const queryResult = await dal.deleteArticleById(dbClient, [blogId]);

                return queryResult.rows[0];
            }
        } finally {
            dbClient.release();
        }
    },
    searchArticle: async (searchString) => {
        const dbClient = await cockroachLib.dbCponnectionPool.connect();
        try {
            const queryResult = await dal.searchArticle(dbClient, [searchString]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
};