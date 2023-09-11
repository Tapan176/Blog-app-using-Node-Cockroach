module.exports = {
    selectAllArticles: 'SELECT * FROM articles',
    
    selectArticleById: `SELECT a.*, 
        t.title AS "category",
        u."firstName", 
        u."lastName", 
        u."email", 
        c.*
        FROM articles AS a
        JOIN users AS u ON a."userId" = u."id"
        LEFT JOIN comments AS c ON a."id" = c."articleId"
        LEFT JOIN categories AS t ON a."categoryId" = t."id"
        WHERE a."id" = $1`,

    selectArticlesByCategoryId: 'SELECT * FROM articles WHERE "categoryId" = $1',
    
    selectArticlesByUserId: 'SELECT * FROM articles WHERE "userId" = $1',

    selectUserIdByBlogId: 'SELECT "userId" FROM articles WHERE "id" = $1',

    insertArticle: 'INSERT INTO articles ("title", "body", "userId", "categoryId") VALUES ($1, $2, $3, $4)',

    updateArticle: 'UPDATE articles SET "title" = $1, "body" = $2, "categoryId" = $3 WHERE "id" = $4',

    deleteArticleById: 'DELETE FROM articles WHERE "id" = $1',

    selectArticleByTitleAndUserId: 'SELECT * FROM articles WHERE "title" = $1 AND "userId" = $2',

    selectCategoriesByTitle: 'SELECT * FROM categories WHERE "title" = $1',
    
    insertCategory: 'INSERT INTO categories ("title") VALUES ($1)',

    searchArticle: `SELECT a.*
        FROM articles a
        LEFT JOIN users u ON a."userId" = u."id"
        WHERE a."title" LIKE '%$1%'
        OR a."body" LIKE '%$1%'
        OR u."firstName" LIKE '%$1%' OR u."lastName" LIKE '%$1%'`
};
