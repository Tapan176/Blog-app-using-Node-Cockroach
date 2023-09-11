const cockroachLib = require('../../cockroach');
const {
    selectCommentsByArticleId,
    insertComment,
    updateComment,
    deleteCommentById,
    selectUserIdByCommentId
} = require('./comment.sql');

module.exports = {
    getAllComments: async(blogId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(selectCommentsByArticleId, [blogId]);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    addComment: async(blogId, userIdByAdmin, userId, comment, userRole) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if(userRole == 'admin') {
                const queryResult = await dbClient.query(insertComment, [blogId, userIdByAdmin, comment]);
                return queryResult.rows;
            } else {
                const queryResult = await dbClient.query(insertComment, [blogId, userId, comment]);
                return queryResult.rows;
            }
        } finally {
            dbClient.release();
        }
    },
    editComment: async(commentId, userId, comment, userRole) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if(userRole == 'admin') {
                const queryResult = await dbClient.query(updateComment, [comment, commentId]);
                return queryResult.rows;
            } else {
                const selectedBlogUserId = await dbClient.query(selectUserIdByCommentId, [commentId]);
            
                if (selectedBlogUserId.rows[0].userId != userId) {
                    throw new Error('comment_not_authorized');
                }
                const queryResult = await dbClient.query(updateComment, [comment, commentId]);
                return queryResult.rows;
            }
        } finally {
            dbClient.release();
        }
    },
    deleteComment: async(commentId, userId, userRole) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            if(userRole == 'admin') {
                const queryResult = await dbClient.query(deleteCommentById, [commentId]);
                return queryResult.rows;
            } else {
                const selectedBlogUserId = await dbClient.query(selectUserIdByCommentId, [commentId]);
            
                if (selectedBlogUserId.rows[0].userId != userId) {
                    throw new Error('comment_not_authorized');
                }
                const queryResult = await dbClient.query(deleteCommentById, [commentId]);
                return queryResult.rows;
            }
        } finally {
            dbClient.release();
        }
    },
};