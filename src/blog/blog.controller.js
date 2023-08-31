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
            const blogId = request.params.id;
            const responseBody = await services.getArticlesById(blogId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    addArticle: async (request, response, next) => {
        try {
            const userId = request.session.user.id;
            const { title, body, category } = request.body;
            const responseBody = await services.addArticle(title, body, category, userId);
            response.status(201).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    editArticle: async (request, response, next) => {
        try {
            const userId = request.session.user.id;
            const blogId = request.params.id;
            const { title, body, category } = request.body;
            const responseBody = await services.editArticle(blogId, title, body, category, userId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    deleteArticle: async (request, response, next) => {},
    searchArticle: async (request, response, next) => {},
    searchArticleByCategory: async (request, response, next) => {},
};