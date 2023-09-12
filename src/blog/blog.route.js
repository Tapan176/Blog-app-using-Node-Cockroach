const express = require('express');
const router = express.Router();

const controller = require('./blog.controller');
const { authenticateUser } = require('../middleware/passport');

router.route('/blogs')
        .get(controller.getAllArticles)
        .post(authenticateUser, controller.addArticle);

router.route('/blogs/search')
        .get(controller.searchArticle);
router.route('/blogs/myblogs')
        .get(authenticateUser, controller.getUserArticles);

router.route('/blogs/:blogId')
        .get(controller.getArticlesById)
        .put(authenticateUser, controller.editArticle)
        .delete(authenticateUser, controller.deleteArticle);
router.route('/blogs/categories/:categoryId')
        .get(controller.getArticlesByCategory);

module.exports = router;