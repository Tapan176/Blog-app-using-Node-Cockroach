const express = require('express');
const router = express.Router();

const { getAllArticles, getArticlesById, addArticle, editArticle } = require('./blog.controller');
const { authenticateUser } = require('../middleware/passport');

router.get('/blogs', getAllArticles);
router.get('/blogs/:id', getArticlesById);
router.post('/blogs', authenticateUser, addArticle);
router.put('/blogs/:id', authenticateUser, editArticle);

module.exports = router;