const express = require('express');
const router = express.Router();

const { login, signUp, logout } = require('./auth.controller');

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/logout', logout);

module.exports = router;