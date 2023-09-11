const express = require('express');
const router = express.Router();

const { getAllArticles, 
        getArticlesById, 
        addArticle, 
        editArticle, 
        deleteArticle, 
        searchArticle, 
        getArticlesByCategory,
        getUserArticles } = require('./blog.controller');
const { authenticateUser } = require('../middleware/passport');


  /**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog endpoints
 */

  /**
 * @swagger
 * /blogs:
 *   get:
 *     tags: 
 *       - Blog
 *   post:
 *     tags: 
 *       - Blog
 */
router.route('/blogs')
        .get(getAllArticles)
        .post(authenticateUser, addArticle);

router.get('/blogs/search', searchArticle);
router.get('/blogs/myblogs', authenticateUser, getUserArticles);

router.route('/blogs/:blogId')
        .get(getArticlesById)
        .put(authenticateUser, editArticle)
        .delete(authenticateUser, deleteArticle);
router.get('/blogs/categories/:categoryId', getArticlesByCategory);

module.exports = router;