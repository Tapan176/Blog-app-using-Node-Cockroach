const services = require('./blog.service');

module.exports = {
    getAllArticles: async (request, response, next) => {
        try {
            const responseBody = await services.getAllArticles();
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    getArticlesById: async (request, response, next) => {
        try {
            const { blogId } = request.params;
            const responseBody = await services.getArticlesById(blogId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    getArticlesByCategory: async (request, response, next) => {
        try {
            const categoryId = request.params.categoryId;
            const responseBody = await services.getArticlesByCategory(categoryId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    getUserArticles: async (request, response, next) => {
        try {
            const userId = request.session.user.id;
            const responseBody = await services.getUserArticles(userId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    addArticle: async (request, response, next) => {
        try {
            const { id: userId, role: userRole } = request.user;
            const { title, body, category, userIdByAdmin } = request.body;
            const responseBody = await services.addArticle(title, body, category, userIdByAdmin, userId, userRole);
            response.status(201).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    editArticle: async (request, response, next) => {
        try {
            const { id: userId, role: userRole } = request.user;
            const { blogId } = request.params;
            const { title, body, category } = request.body;
            const responseBody = await services.editArticle(blogId, title, body, category, userId, userRole);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    deleteArticle: async (request, response, next) => {
        try {
            const { id: userId, role: userRole } = request.user;
            const { blogId } = request.params;
            const responseBody = await services.deleteArticle(blogId, userId, userRole);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    searchArticle: async (request, response, next) => {
        try {
            const { searchString } = request.query;
            const responseBody = await services.searchArticle(searchString);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    applyFiltersOnBlogs: async (request, response, next) => {
        try {
            const { categoryId: categoryId, publishedAfter: publishedAfter, totalLikes: totalLikes, totalDislikes: totalDislikes } = request.query;
            console.log(categoryId, new Date(publishedAfter), totalLikes, totalDislikes);
            // const responseBody = await services.applyFiltersOnBlogs(categoryId, publishedAfter, parseInt(totalLikes), parseInt(totalDislikes));
            // response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
};