const express = require('express');

const router = express.Router();
const { validate } = require('express-validation');

const controller = require('./blog.controller');
const { authenticateUser } = require('../middleware/passport');
const validation = require('./blog.validation');

/**
* @swagger
* tags:
*   name: Blog
*   description: Blog endpoints
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* /blog/blogs:
*   get:
*     tags:
*       - Blog
*     summary: Get all blogs
*     responses:
*       '200':
*         $ref: 'components/blog/responseContract.json#/successfulRetrievalOfAllBlogs'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*   post:
*     tags:
*       - Blog
*     summary: Add a blog
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/blog/requestContract.json#/AddBlog'
*     responses:
*       '200':
*         $ref: 'components/blog/responseContract.json#/successfulAdditionOfBlog'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '409':
*         $ref: 'components/errorContract.json#/blogAlreadyExist'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/blogs')
  .get(controller.getAllArticles)
  .post(authenticateUser, validate(validation.addArticle), controller.addArticle);

/**
* @swagger
* /blog/blogs/search:
*   get:
*     tags:
*       - Blog
*     summary: Search blogs
*     parameters:
*       - in: query
*         name: searchString
*         required: true
*         schema:
*           type: string
*     responses:
*       '200':
*         $ref: 'components/blog/responseContract.json#/successfulRetrievalOfSearchResults'
*       '400':
*         $ref: 'components/errorContract.json#/badRequest'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/blogs/search')
  .get(validate(validation.searchArticle), controller.searchArticle);

/**
* @swagger
* /blog/blogs/myblogs:
*   get:
*     tags:
*       - Blog
*     summary: Get user's blogs
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         $ref: 'components/blog/responseContract.json#/successfulRetrievalOfUserBlogs'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/blogs/myblogs')
  .get(authenticateUser, controller.getUserArticles);

/**
* @swagger
* /blog/blogs/:blogId:
*   get:
*     tags:
*       - Blog
*     summary: Get an blog by its ID
*     parameters:
*       - in: path
*         name: blogId
*         required: true
*         schema:
*           type: integer
*     responses:
*       '200':
*         $ref: 'components/blog/responseContract.json#/successfulRetrievalOfBlog'
*       '404':
*         $ref: 'components/errorContract.json#/blogNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*   put:
*     tags:
*       - Blog
*     summary: Edit a blog
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: blogId
*         required: true
*         schema:
*           type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: 'components/blog/requestContract.json#/UpdateBlog'
*     responses:
*       '200':
*         $ref: 'components/blog/responseContract.json#/successfulUpdateOfBlog'
*       '400':
*         $ref: 'components/errorContract.json#/badRequest'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '404':
*         $ref: 'components/errorContract.json#/blogNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*   delete:
*     tags:
*       - Blog
*     summary: Delete a blog
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: blogId
*         required: true
*         schema:
*           type: integer
*     responses:
*       '200':
*         $ref: 'components/blog/responseContract.json#/successfulDeletionOfBlog'
*       '400':
*         $ref: 'components/errorContract.json#/badRequest'
*       '401':
*         $ref: 'components/errorContract.json#/unauthorized'
*       '404':
*         $ref: 'components/errorContract.json#/blogNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/blogs/:blogId')
  .get(validate(validation.getArticlesById), controller.getArticlesById)
  .put(authenticateUser, validate(validation.editArticle), controller.editArticle)
  .delete(authenticateUser, validate(validation.deleteArticle), controller.deleteArticle);

/**
* @swagger
* /blog/blogs/categories/:categoryId:
*   get:
*     tags:
*       - Blog
*     summary: Get blogs by category
*     parameters:
*       - in: path
*         name: categoryId
*         required: true
*         schema:
*           type: integer
*     responses:
*       '200':
*         $ref: 'components/blog/responseContract.json#/successfulRetrievalOfBlogsByCategory'
*       '404':
*         $ref: 'components/errorContract.json#/blogNotFound'
*       '500':
*         $ref: 'components/errorContract.json#/internalServerError'
*/
router.route('/blogs/categories/:categoryId')
  .get(validate(validation.getArticlesByCategory), controller.getArticlesByCategory);

module.exports = router;
