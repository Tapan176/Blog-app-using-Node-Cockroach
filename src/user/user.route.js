const express = require('express');
const router = express.Router();
const { getAllUserDetails, getUserDetailsById, getUserDetailsByEmail, createUser, editUser, deleteUser } = require('./user.controller');

router.get('/users', getAllUserDetails);
router.get('/users', createUser);
router.post('/users/email', getUserDetailsByEmail);
router.get('/users/:id', getUserDetailsById);
router.put('/users/:id', editUser);
router.delete('/users/:id', deleteUser);

module.exports = router;