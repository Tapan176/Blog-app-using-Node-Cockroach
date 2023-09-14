module.exports = {
  selectCommentsByArticleId: async (dbClient, commentData) => {
    const sqlStmt = `
      SELECT * 
      FROM comments 
      WHERE "articleId" = $1
      ;`;
    const parameters = [commentData.blogId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  insertComment: async (dbClient, commentData) => {
    const sqlStmt = `
      INSERT INTO comments 
        (
          "articleId"
          ,"userId"
          ,"comment"
        ) 
      VALUES 
        (
          $1
          ,$2
          ,$3
        );`;
    const parameters = [commentData.blogId, commentData.userId, commentData.comment];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  updateComment: async (dbClient, commentData) => {
    const sqlStmt = `
      UPDATE comments 
      SET "comment" = $1 
      WHERE "id" = $2
      ;`;
    const parameters = [commentData.comment, commentData.commentId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  deleteCommentById: async (dbClient, commentData) => {
    const sqlStmt = `
      DELETE FROM comments 
      WHERE "id" = $1
      );`;
    const parameters = [commentData.commentId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
  selectUserIdByCommentId: async (dbClient, commentData) => {
    const sqlStmt = `
      SELECT "userId" 
      FROM comments 
      WHERE "id" = $1
      );`;
    const parameters = [commentData.commentId];
    const queryResult = await dbClient.query(sqlStmt, parameters);
    return queryResult;
  },
};
