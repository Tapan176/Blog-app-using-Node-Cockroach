const express = require('express');
const router = express.Router();
const { getAllUserDetails, getUserDetailsById, getUserDetailsByEmail } = require('./user.controller');

router.get('/users', getAllUserDetails);
router.get('/users/:id', getUserDetailsById);
router.post('/users/email', getUserDetailsByEmail);

module.exports = router;