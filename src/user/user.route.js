const express = require('express');
const router = express.Router();

const { getAllUserDetails, 
        getUserDetailsById, 
        getUserDetailsByEmail, 
        createUser, 
        editUser, 
        deleteUser,
        changePassword,
        changeName } = require('./user.controller');

const { authenticateUser, authenticateAdmin } = require('../middleware/passport');

router.route('/users')
        .get(authenticateAdmin, getAllUserDetails)
        .post(authenticateAdmin, createUser);
router.get('/users/email', authenticateAdmin, getUserDetailsByEmail);
router.route('/users/:id')
        .get(authenticateAdmin, getUserDetailsById)
        .put(authenticateAdmin, editUser)
        .delete(authenticateAdmin, deleteUser);
router.put('/users/:id/changePassword', authenticateUser, changePassword);
router.put('/users/:id/changeName', authenticateUser, changeName);

module.exports = router;