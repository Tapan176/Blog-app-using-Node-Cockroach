const express = require('express');
const router = express.Router();

const { getAllArticles, 
        getArticlesById, 
        addArticle, 
        editArticle, 
        deleteArticle, 
        searchArticle, 
        // applyFiltersOnBlogs, 
        getArticlesByCategory,
        getUserArticles } = require('./blog.controller');
const { authenticateUser } = require('../middleware/passport');

router.get('/blogs', getAllArticles);
router.post('/blogs', authenticateUser, addArticle);
router.get('/blogs/search', searchArticle);
// router.get('/blogs/filter', applyFiltersOnBlogs);
router.get('/blogs/myblogs', authenticateUser, getUserArticles);
router.get('/blogs/:blogId', getArticlesById);
router.put('/blogs/:blogId', authenticateUser, editArticle);
router.delete('/blogs/:blogId', authenticateUser, deleteArticle);
router.get('/blogs/categories/:categoryId', getArticlesByCategory);

module.exports = router;