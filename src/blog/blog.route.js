const express = require('express');
const router = express.Router();

const { getAllArticles, 
        getArticlesById, 
        addArticle, 
        editArticle, 
        deleteArticle, 
        searchArticle, 
        applyFiltersOnBlogs, 
        getArticlesByCategory,
        getUserArticles } = require('./blog.controller');
const { authenticateUser } = require('../middleware/passport');

router.route('/blogs')
        .get(getAllArticles)
        .post(authenticateUser, addArticle);

router.get('/blogs/search', searchArticle);
router.get('/blogs/filter', applyFiltersOnBlogs);
router.get('/blogs/myblogs', authenticateUser, getUserArticles);

router.route('/blogs/:blogId')
        .get(getArticlesById)
        .put(authenticateUser, editArticle)
        .delete(authenticateUser, deleteArticle);
router.get('/blogs/categories/:categoryId', getArticlesByCategory);

module.exports = router;