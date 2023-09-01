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
    deleteArticle: async (request, response, next) => {
        try {
            const userId = request.session.user.id;
            const blogId = request.params.id;
            const responseBody = await services.deleteArticle(blogId, userId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    searchArticle: async (request, response, next) => {
        try {
            const searchString = request.query.searchString;
            const responseBody = await services.searchArticle(searchString);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    // applyFiltersOnBlogs: async (request, response, next) => {
    //     try {
    //         const categoryId = request.query.categoryId;
    //         const publishedAfter = new Date(request.query.publishedAfter);
    //         const totalLikes = request.query.totalLikes;
    //         const totalDislikes = request.query.totalDislikes;
    //         console.log(categoryId, publishedAfter, totalLikes, totalDislikes);
    //         // const responseBody = await services.applyFiltersOnBlogs(categoryId, publishedAfter, parseInt(totalLikes), parseInt(totalDislikes));
    //         // response.status(200).json(responseBody);
    //     } catch (error) {
    //         next(error);
    //     }
    // },
};