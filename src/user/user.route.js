const express = require('express');
const router = express.Router();

const { getAllUserDetails, 
        getUserDetailsById, 
        getUserDetailsByEmail, 
        createUser, 
        editUser, 
        deleteUser } = require('./user.controller');

const { authenticateAdmin } = require('../middleware/passport');

router.route('/users')
        .get(authenticateAdmin, getAllUserDetails)
        .post(authenticateAdmin, createUser);
router.get('/users/email', authenticateAdmin, getUserDetailsByEmail);
router.route('/users/:id')
        .get(authenticateAdmin, getUserDetailsById)
        .put(authenticateAdmin, editUser)
        .delete(authenticateAdmin, deleteUser);

module.exports = router;