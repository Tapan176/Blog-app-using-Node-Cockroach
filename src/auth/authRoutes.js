const express = require('express');
const router = express.Router();

const { login, signUp } = require('./authController');

router.post('/login', login);
router.post('/signUp', signUp);

module.exports = router;