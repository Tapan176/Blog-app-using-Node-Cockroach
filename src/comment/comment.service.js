const cockroachLib = require('../../cockroach');

module.exports = {
    getAllComments: async(blogId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`SELECT * FROM comments WHERE "articleId" = '${blogId}'`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    addComment: async(blogId, userId, comment) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const queryResult = await dbClient.query(`INSERT INTO comments ("articleId", "userId", "comment") VALUES ('${blogId}', '${userId}', '${comment}')`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    editComment: async(commentId, userId, comment) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const selectedBlogUserId = await dbClient.query(`SELECT "userId" FROM comments WHERE "id" = '${commentId}'`);
            
            if (selectedBlogUserId.rows[0].userId != userId) {
                throw new Error('comment_not_authorized');
            }
            const queryResult = await dbClient.query(`UPDATE comments SET "comment" = '${comment}' WHERE "id" = '${commentId}' AND "userId" = '${userId}'`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
    deleteComment: async(commentId, userId) => {
        const dbClient = await cockroachLib.dbPool.connect();
        try {
            const selectedBlogUserId = await dbClient.query(`SELECT "userId" FROM comments WHERE "id" = '${commentId}'`);
            
            if (selectedBlogUserId.rows[0].userId != userId) {
                throw new Error('comment_not_authorized');
            }
            const queryResult = await dbClient.query(`DELETE FROM comments WHERE "id" = '${commentId}' AND "userId" = '${userId}'`);
            return queryResult.rows;
        } finally {
            dbClient.release();
        }
    },
};