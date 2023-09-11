module.exports = {
    selectCommentsByArticleId: 'SELECT * FROM comments WHERE "articleId" = $1',

    insertComment: 'INSERT INTO comments ("articleId", "userId", "comment") VALUES ($1, $2, $3)',

    updateComment: 'UPDATE comments SET "comment" = $1 WHERE "id" = $2',

    deleteCommentById: 'DELETE FROM comments WHERE "id" = $1',

    selectUserIdByCommentId: 'SELECT "userId" FROM comments WHERE "id" = $1'
};
