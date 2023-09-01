const services = require('./comment.service');

module.exports = {
    getAllComments: async(request, response, next) => {
        try {
            const blogId = request.params.blogId;
            const responseBody = await services.getAllComments(blogId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    addComment: async(request, response, next) => {
        try {
            const blogId = request.params.blogId;
            const userId = request.session.user.id;
            const { comment } = request.body;
            const responseBody = await services.addComment(blogId, userId, comment);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    editComment: async(request, response, next) => {
        try {
            const commentId = request.params.commentId;
            const userId = request.session.user.id;
            const { comment } = request.body;
            const responseBody = await services.editComment(commentId, userId, comment);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    deleteComment: async(request, response, next) => {
        try {
            const commentId = request.params.commentId;
            const userId = request.session.user.id;
            const responseBody = await services.deleteComment(commentId, userId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
};