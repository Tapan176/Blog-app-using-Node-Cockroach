const express = require('express');
const router = express.Router();
const { getAllUserDetails, getUserDetailsById, getUserDetailsByEmail } = require('./user.controller');

router.get('/', getAllUserDetails);
router.get('/:id', getUserDetailsById);
router.post('/email', getUserDetailsByEmail);

module.exports = router;