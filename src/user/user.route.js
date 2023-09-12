const express = require('express');
const router = express.Router();

const controller = require('./user.controller');

const { authenticateUser, authenticateAdmin } = require('../middleware/passport');

router.route('/users')
        .get(authenticateAdmin, controller.getAllUserDetails)
        .post(authenticateAdmin, controller.createUser);
router.route('/users/email')
        .get(authenticateAdmin, controller.getUserDetailsByEmail);
router.route('/users/:id')
        .get(authenticateAdmin, controller.getUserDetailsById)
        .put(authenticateAdmin, controller.editUser)
        .delete(authenticateAdmin, controller.deleteUser);
router.route('/users/:id/change-password')
        .put(authenticateUser, controller.changePassword);
router.route('/users/:id/change-name')
        .put(authenticateUser, controller.changeName);

module.exports = router;