const services = require('./comment.service');

module.exports = {
    getAllComments: async(request, response, next) => {
        try {
            const { blogId } = request.params;
            const responseBody = await services.getAllComments(blogId);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    addComment: async(request, response, next) => {
        try {
            const { blogId } = request.params;
            const { id: userId, role: userRole } = request.user;
            const { comment, userIdByAdmin } = request.body;
            const responseBody = await services.addComment(blogId, userIdByAdmin, userId, comment, userRole);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    editComment: async(request, response, next) => {
        try {
            const { commentId } = request.params;
            const { id: userId, role: userRole } = request.user;
            const { comment } = request.body;
            const responseBody = await services.editComment(commentId, userId, comment, userRole);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
    deleteComment: async(request, response, next) => {
        try {
            const { commentId } = request.params;
            const { id: userId, role: userRole } = request.user;
            const responseBody = await services.deleteComment(commentId, userId, userRole);
            response.status(200).json(responseBody);
        } catch (error) {
            next(error);
        }
    },
};