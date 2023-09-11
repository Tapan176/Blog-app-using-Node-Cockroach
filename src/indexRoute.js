const express = require('express');
const router = express.Router();

const authRoutes = require('./auth/auth.route');
const blogRoutes = require('./blog/blog.route');
const commentRoutes = require('./comment/comment.route');
const userRoutes = require('./user/user.route');
const swaggerRoutes = require('../.config/swagger.config')

router.use('/auth', authRoutes);
router.use('/blog', blogRoutes);
router.use('/comment', commentRoutes);
router.use('/user', userRoutes);
router.use('/apiDocs', swaggerRoutes);

module.exports = router;